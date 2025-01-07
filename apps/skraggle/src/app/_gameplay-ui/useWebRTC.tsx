"use client";
import { onValue, ref, set, onDisconnect } from "firebase/database";
import { useEffect, useRef } from "react";
import { rtdb } from "../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Peer from "simple-peer";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { setStatus } from "@/store/peerStatusSlice";
import { signal } from "@preact/signals-react";

export type PlayerPeers = {
  [playerId: string]: Peer.Instance;
};

type SignalStatusType = {
  [peerId: string]: {
    name: string;
    signalStatus: "pending" | "offline" | "sent";
    timestamp: number;
  };
};

export const playerPeers = signal<PlayerPeers>({});

export default function useWebRTC() {
  const { gameId, playerId, playerName } = useSelector(
    (state: RootState) => state.logIn,
  );
  const { logOutOnError } = useLogOut();
  const dispatch = useDispatch();
  const setPeers = useRef(false);
  const offersSent = useRef(false);

  useEffect(() => {
    if (!playerId) {
      setPeers.current = false;
      offersSent.current = false;
      return;
    }
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

    const playersListener = onValue(playersRef, (snapshot) => {
      if (offersSent.current) return;
      if (!snapshot.exists()) return;
      const data = snapshot.val() as SignalStatusType;

      const previousPeerId = getPreviousPeerId(data, playerId);
      if (!previousPeerId) {
        //set up first player
        offersSent.current = true;
        const hasSignaledRef = ref(
          rtdb,
          `activeGames/${gameId}/signaling/players/${playerId}/signalStatus`,
        );
        set(hasSignaledRef, "sent");
        return;
      }

      if (!data[previousPeerId]) return;
      if (data[previousPeerId].signalStatus === "pending") return;

      offersSent.current = true;
      setTimeout(() => {
        const hasSignaledRef = ref(
          rtdb,
          `activeGames/${gameId}/signaling/players/${playerId}/signalStatus`,
        );
        set(hasSignaledRef, "sent");
      }, 1000);

      Object.keys(data).forEach((key) => {
        if (key === playerId) return;
        if (playerPeers.value[key]) return;
        playerPeers.value[key] = createPeer(true, key, data[key].name);
        dispatch(setStatus({ playerId: key, status: "pending" }));
      });
    });

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
      playerPeers.value[data.playerId] = remotePeer;
      dispatch(setStatus({ playerId: data.playerId, status: "pending" }));
    });

    //listen for answers and assign signals to their respective player ID's host peer
    const answerListener = onValue(answerRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const key = data.playerId as string;
      if (!playerPeers.value[key]) return;
      if (playerPeers.value[key].connected) return;
      playerPeers.value[key].signal(data.signal);
    });

    //unsubscribe listeners
    return () => {
      playersListener();
      offerListener();
      answerListener();
    };
  }, [playerId]);

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
      try {
        await fetchApi("sendPeerSignal", {
          isInitiator: initiator,
          peerId,
          signal,
          name,
        });
      } catch (error) {
        logOutOnError(error);
        Object.keys(playerPeers.value).forEach((key) => {
          playerPeers.value[key].destroy(
            new Error(`disconnected from ${name}`),
          );
        });
      }
    });

    let isConnected = false;

    peer.on("connect", () => {
      peer.send(`connected to ${playerName}`);
      dispatch(setStatus({ playerId: peerId, status: "connected" }));
      isConnected = true;
    });

    //removes peer if player is not connected within a certain time
    setTimeout(() => {
      if (!isConnected && playerPeers.value[peerId]) {
        if (playerPeers.value[peerId].connected) return;
        playerPeers.value[peerId].destroy(new Error(`${name} timed out`));
      }
    }, 20000);

    peer.on("close", () => {
      console.log(`${name} left the game`);
      delete playerPeers.value[peerId];
      dispatch(setStatus({ playerId: peerId, status: "error" }));
    });

    peer.on("error", (error) => {
      console.log(error.message);
      delete playerPeers.value[peerId];
      dispatch(setStatus({ playerId: peerId, status: "error" }));
    });

    return peer;
  }

  useReceiveWebRTCData();
}

function getPreviousPeerId(
  data: SignalStatusType,
  targetPeerId: string,
): string | null {
  // Convert data to an array of entries and sort by timestamp
  const sortedPeers = Object.entries(data)
    .filter(([, data]) => data.signalStatus !== "offline")
    .sort(([, a], [, b]) => a.timestamp - b.timestamp);

  const targetIndex = sortedPeers.findIndex(
    ([peerId]) => peerId === targetPeerId,
  );
  if (targetIndex <= 0) {
    return null;
  }

  return sortedPeers[targetIndex - 1][0];
}

function useReceiveWebRTCData() {
  const { splashScreenComplete, callUnityFunction } = useUnityReactContext();
  const peerStatus = useSelector((state: RootState) => state.peerStatus);
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { enableWebRTCAfterFirstTurn } = useSelector(
    (state: RootState) => state.turnState,
  );

  //listen for data when Unity player finishes loading
  useEffect(() => {
    if (!splashScreenComplete) return;
    if (!gameId) return;

    Object.keys(playerPeers.value).forEach((key) => {
      playerPeers.value[key].removeAllListeners("data");
      if (!enableWebRTCAfterFirstTurn) return;
      playerPeers.value[key].on("data", (data) => {
        try {
          const parsedData = JSON.parse(data);
          if (!("data" in parsedData)) return;
          callUnityFunction("ReceiveWebRTCData", data);
        } catch (error) {
          console.log(data);
        }
      });
    });
  }, [splashScreenComplete, peerStatus, enableWebRTCAfterFirstTurn, gameId]);
}
