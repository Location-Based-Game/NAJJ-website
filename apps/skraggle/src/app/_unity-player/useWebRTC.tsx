import { onValue, ref, get, set, onDisconnect } from "firebase/database";
import { useEffect, useRef } from "react";
import { rtdb } from "../firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Peer from "simple-peer";
import { fetchApi } from "@/lib/fetchApi";
import useLogOutOnError from "@/hooks/useLogOutOnError";
import { CallUnityFunctionType } from "./UnityContext";
import { useGetPlayers } from "@/components/GetPlayers";

export type PlayerPeers = {
  [playerId: string]: Peer.Instance;
};

type SignalStatusType = {
  [peerId: string]: {
    name: string;
    signalStatus: "pending" | "offline" | "sent";
    timestamp: number;
  };
}

export default function useWebRTC(
  splashScreenComplete: boolean,
  callUnityFunction: CallUnityFunctionType,
) {
  const { gameId, playerId, playerName } = useSelector(
    (state: RootState) => state.logIn,
  );
  const { logOutOnError } = useLogOutOnError(false);
  const playerPeers = useRef<PlayerPeers>({});
  const setPeers = useRef(false);
  const offersSent = useRef(false);

  useEffect(() => {
    if (!playerId) return;
    if (!splashScreenComplete) return;
    if (setPeers.current) return;
    setPeers.current = true;

    const signalStatusRef = ref(
      rtdb,
      `activeGames/${gameId}/signaling/players/${playerId}/signalStatus`,
    );
    onDisconnect(signalStatusRef).set("offline");

    const offerRef = ref(
      rtdb,
      `activeGames/${gameId}/signaling/${playerId}/peer-offer`,
    );
    const playersRef = ref(rtdb, `activeGames/${gameId}/signaling/players`);
    const answerRef = ref(
      rtdb,
      `activeGames/${gameId}/signaling/${playerId}/peer-answer`,
    );

    //Create a host peer for every other player in the room
    // get(playersRef).then((snapshot) => {
    //   if (!snapshot.exists()) return;
    //   const data = snapshot.val();
    //   Object.keys(data).forEach((key) => {
    //     if (key === playerId) return;
    //     playerPeers.current[key] = createPeer(true, key);
    //   });
    // });

    const playersListener = onValue(playersRef, (snapshot) => {
      if (offersSent.current) return;
      if (!snapshot.exists()) return;
      const data = snapshot.val() as SignalStatusType;

      // const oldestPeerId = Object.entries(data).reduce((oldest, [peerId, info]) => {
      //   return info.timestamp < (data[oldest]?.timestamp ?? Infinity) ? peerId : oldest;
      // }, "");

      // if (playerId === oldestPeerId) {
      //   //mark first player for signaling
      //   offersSent.current = true;
      //   const hasSignaledRef = ref(
      //     rtdb,
      //     `activeGames/${gameId}/signaling/players/${playerId}/signalStatus`,
      //   );
      //   set(hasSignaledRef, "sent");
      //   return;
      // }

      // const currentTimestamp = data[playerId].timestamp;
      // delete data[playerId];
      // console.log(data);

      // const latestPeerId = Object.entries(data)
      //   .filter(([, info]) => info.signalStatus === "sent")
      //   .reduce((latest, [peerId, info]) => {
      //     return info.timestamp > (data[latest]?.timestamp ?? -Infinity)
      //       ? peerId
      //       : latest;
      //   }, "");
      //   console.log(latestPeerId)

      const previousPeerId = getPreviousPeerId(data, playerId);
      if (!previousPeerId) {
        console.log("first");
        offersSent.current = true;
        const hasSignaledRef = ref(
          rtdb,
          `activeGames/${gameId}/signaling/players/${playerId}/signalStatus`,
        );
        set(hasSignaledRef, "sent");
        return;
      }
      console.log(data)

      if (!data[previousPeerId]) return;
      if (data[previousPeerId].signalStatus === "pending") return;
      console.log("previous id: ", data[previousPeerId].name);

      offersSent.current = true;
      setTimeout(() => {        
        const hasSignaledRef = ref(
          rtdb,
          `activeGames/${gameId}/signaling/players/${playerId}/signalStatus`,
        );
        set(hasSignaledRef, "sent");
      }, 3000);

      Object.keys(data).forEach((key) => {
        if (key === playerId) return;
        if (playerPeers.current[key]) return;
        playerPeers.current[key] = createPeer(true, key, data[key].name);
      });
    });

    function getPreviousPeerId(data: SignalStatusType, targetPeerId: string): string | null {
      // Convert data to an array of entries and sort by timestamp
      const sortedPeers = Object.entries(data).sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
      // Find the index of the target peerId
      const targetIndex = sortedPeers.findIndex(([peerId]) => peerId === targetPeerId);
    
      // If targetPeerId is the oldest or not found, return null
      if (targetIndex <= 0) {
        return null;
      }
    
      // Return the peerId of the previous entry
      return sortedPeers[targetIndex - 1][0];
    }

    //listen for offers and create a remote peer & answer for each offer
    const offerListener = onValue(offerRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as {
        playerId: string;
        name: string;
        signal: Peer.SignalData;
      };
      const remotePeer = createPeer(false, data.playerId, data.name);
      remotePeer.signal(data.signal);
      playerPeers.current[data.playerId] = remotePeer;
    });

    //listen for answers and assign signals to their respective player ID's host peer
    const answerListener = onValue(answerRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const key = data.playerId as string;
      if (!playerPeers.current[key]) return;
      if (playerPeers.current[key].connected) return;
      playerPeers.current[key].signal(data.signal);
    });

    //unsubscribe listeners
    return () => {
      playersListener();
      offerListener();
      answerListener();
    };
  }, [playerId, splashScreenComplete]);

  function createPeer(initiator: boolean, peerId: string, name: string) {
    const peer = new Peer({
      initiator,
      trickle: false,
      objectMode: true,
      config: {
        iceServers: [
          {
            urls: [
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
            ],
          },
        ],
      },
    });

    peer.on("signal", async (signal) => {
      const params = new URLSearchParams({
        isInitiator: initiator.toString(),
        peerId,
        signalString: JSON.stringify(signal),
        name,
      }).toString();

      try {
        await fetchApi(`/api/send-peer-signal?${params}`);
      } catch (error) {
        logOutOnError(error);
        Object.keys(playerPeers.current).forEach((key) => {
          playerPeers.current[key].destroy(
            new Error(`disconnected from ${name}`),
          );
        });
      }
    });

    let isConnected = false;

    peer.on("connect", () => {
      peer.send(`connected to ${playerName}`);
      isConnected = true;
    });

    //removes peer if player is not connected within a certain time
    setTimeout(() => {
      if (!isConnected && playerPeers.current[peerId]) {
        if (playerPeers.current[peerId].connected) return;
        playerPeers.current[peerId].destroy(new Error(`${name} timed out`));
        delete playerPeers.current[peerId];
      }
    }, 20000);

    peer.on("close", () => {
      console.log(`${name} left the game`);
      delete playerPeers.current[peerId];
    });

    peer.on("error", (error) => {
      console.log(error.message);
      delete playerPeers.current[peerId];
    });

    peer.on("data", (data) => {
      try {
        const parsedData = JSON.parse(data);
        if (!("action" in parsedData)) return;
        callUnityFunction("ControlBoardItem", data);
      } catch (error) {
        console.log(data);
      }
    });

    return peer;
  }

  return { playerPeers };
}
