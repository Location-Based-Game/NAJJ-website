import { onValue, ref, get } from "firebase/database";
import { useEffect, useRef } from "react";
import { rtdb } from "../firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Peer from "simple-peer";
import { fetchApi } from "@/lib/fetchApi";
import useLogOutOnError from "@/hooks/useLogOutOnError";
import { CallUnityFunctionType } from "./UnityContext";

export type PlayerPeers = {
  [playerId: string]: Peer.Instance;
};

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

  useEffect(() => {
    if (!playerId) return;
    if (!splashScreenComplete) return;
    if (setPeers.current) return;
    setPeers.current = true;

    const offerRef = ref(
      rtdb,
      `activeGames/${gameId}/players/${playerId}/peer-offer`,
    );
    const playersRef = ref(rtdb, `activeGames/${gameId}/players`);
    const answerRef = ref(
      rtdb,
      `activeGames/${gameId}/players/${playerId}/peer-answer`,
    );

    //Create a host peer for every other player in the room
    get(playersRef).then((snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      Object.keys(data).forEach((key) => {
        if (key === playerId) return;
        playerPeers.current[key] = createPeer(true, key);
      });
    });

    //listen for offers and create a remote peer & answer for each offer
    const offerListener = onValue(offerRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const remotePeer = createPeer(false, data.playerId);
      remotePeer.signal(data.signal);
      playerPeers.current[data.playerId] = remotePeer;
    });

    //listen for answers and assign signals to their respective player ID's host peer
    const answerListener = onValue(answerRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const key = data.playerId;
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
            new Error(`disconnected from ${key}`),
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
        playerPeers.current[peerId].destroy(new Error(`${peerId} timed out`));
        delete playerPeers.current[peerId];
      }
    }, 20000);

    peer.on("close", () => {
      console.log(`${peerId} left the game`);
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
