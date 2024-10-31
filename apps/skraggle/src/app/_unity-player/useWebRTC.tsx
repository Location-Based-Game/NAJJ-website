import { onValue, ref, get } from "firebase/database";
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

export default function useWebRTC(
  splashScreenComplete: boolean,
  callUnityFunction: CallUnityFunctionType,
) {
  const { playerData } = useGetPlayers()
  const { gameId, playerId, playerName } = useSelector(
    (state: RootState) => state.logIn,
  );
  const { logOutOnError } = useLogOutOnError(false);
  const playerPeers = useRef<PlayerPeers>({});
  const setPeers = useRef(false);

  useEffect(() => {
    if (!playerId) return;
    if (!splashScreenComplete) return;
    if (setPeers.current) return;
    setPeers.current = true;

    const offerRef = ref(
      rtdb,
      `activeGames/${gameId}/signaling/${playerId}/peer-offer`,
    );
    const playersRef = ref(rtdb, `activeGames/${gameId}/signaling/players`);
    const answerRef = ref(
      rtdb,
      `activeGames/${gameId}/signaling/${playerId}/peer-answer`,
    );

    const delay = Object.keys(playerData).indexOf(playerId) * 1000

    //Create a host peer for every other player in the room
    setTimeout(() => {      
      get(playersRef).then((snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.val();
        Object.keys(data).forEach((key) => {
          if (key === playerId) return;
          playerPeers.current[key] = createPeer(true, key);
        });
      });
    }, delay);

    //listen for offers and create a remote peer & answer for each offer
    const offerListener = onValue(offerRef, async (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val() as {
        playerId: string;
        signal: Peer.SignalData
      }

      // if (playerPeers.current[data.playerId]) {
      //   console.log(data.playerId.localeCompare(playerId, "en", { numeric: true }))
      //   if (data.playerId.localeCompare(playerId, "en", { numeric: true }) > 0) {
      //     await deleteOfferPeer(data.playerId)
      //   } else {
      //     console.log("made it here")
      //     return;
      //   }
      // }

      const remotePeer = createPeer(false, data.playerId);
      remotePeer.signal(data.signal);
      playerPeers.current[data.playerId] = remotePeer;
    });

    //if offer is received, cancel creating an offer for the peer. This *only* happens if players join at the exact same time
    // async function deleteOfferPeer(peerId:string) {
    //   await new Promise<void>((resolve) => {
    //     const interval = setInterval(() => {
    //       if (!playerPeers.current[peerId]) {
    //         clearInterval(interval);
    //         resolve();
    //       }
    //     }, 50)
    //   });
    // }

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
      offerListener();
      answerListener();
    };
  }, [playerId, splashScreenComplete]);

  function createPeer(initiator: boolean, peerId: string) {
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
      }).toString();

      try {
        await fetchApi(`/api/send-peer-signal?${params}`);
      } catch (error) {
        logOutOnError(error);
        Object.keys(playerPeers.current).forEach((key) => {
          playerPeers.current[key].destroy(
            new Error(`disconnected from ${playerData[key].name}`),
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
        playerPeers.current[peerId].destroy(
          new Error(`${playerData[peerId].name} timed out`),
        );
        delete playerPeers.current[peerId];
      }
    }, 20000);

    peer.on("close", () => {
      console.log(`${playerData[peerId].name} left the game`);
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
