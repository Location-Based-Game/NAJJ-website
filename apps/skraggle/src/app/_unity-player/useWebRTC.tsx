import { onValue, ref, set, onDisconnect } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { rtdb } from "../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Peer from "simple-peer";
import { fetchApi } from "@/lib/fetchApi";
import useLogOutOnError from "@/hooks/useLogOutOnError";
import { CallUnityFunctionType } from "./UnityContext";
import { removePeerStatus, setStatus } from "@/store/peerStatusSlice";

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
  const dispatch = useDispatch()
  const setPeers = useRef(false);
  const offersSent = useRef(false);

  useEffect(() => {
    if (!playerId) {
      setPeers.current = false;
      offersSent.current = false;
      return;
    };
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
        if (playerPeers.current[key]) return;
        playerPeers.current[key] = createPeer(true, key, data[key].name);
        dispatch(setStatus({playerId: key, status: "pending"}))
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
      playerPeers.current[data.playerId] = remotePeer;
      dispatch(setStatus({playerId: data.playerId, status: "pending"}))
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
      dispatch(setStatus({playerId: peerId, status: "connected"}))
      isConnected = true;
    });

    //removes peer if player is not connected within a certain time
    setTimeout(() => {
      if (!isConnected && playerPeers.current[peerId]) {
        if (playerPeers.current[peerId].connected) return;
        playerPeers.current[peerId].destroy(new Error(`${name} timed out`));
      }
    }, 20000);

    peer.on("close", () => {
      console.log(`${name} left the game`);
      delete playerPeers.current[peerId];
      dispatch(setStatus({playerId: peerId, status: "error"}))
    });

    peer.on("error", (error) => {
      console.log(error.message);
      delete playerPeers.current[peerId];
      dispatch(setStatus({playerId: peerId, status: "error"}))
    });

    peer.on("data", (data) => {
      try {
        const parsedData = JSON.parse(data);
        if (!("action" in parsedData)) return;
        if (!splashScreenComplete) return;
        callUnityFunction("ControlBoardItem", data);
      } catch (error) {
        console.log(data);
      }
    });

    return peer;
  }

  return { playerPeers };
}

function getPreviousPeerId(data: SignalStatusType, targetPeerId: string): string | null {
  // Convert data to an array of entries and sort by timestamp
  const sortedPeers = Object.entries(data)
    .filter(([, data]) => data.signalStatus !== "offline")
    .sort(([, a], [, b]) => a.timestamp - b.timestamp);

  const targetIndex = sortedPeers.findIndex(([peerId]) => peerId === targetPeerId);
  if (targetIndex <= 0) {
    return null;
  }

  return sortedPeers[targetIndex - 1][0];
}