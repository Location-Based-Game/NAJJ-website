import { onValue, ref, set, get } from "firebase/database";
import { useEffect, useRef } from "react";
import { rtdb } from "../firebaseConfig";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Peer from "simple-peer";
import { fetchApi } from "@/lib/fetchApi";

export type PlayerPeers = {
  [playerId: string]: Peer.Instance;
};

export default function useWebRTC() {
  const { gameId, playerId, playerName } = useSelector(
    (state: RootState) => state.logIn,
  );

  const playerPeers = useRef<PlayerPeers>({});

  useEffect(() => {
    if (!playerId) return;

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
    onValue(offerRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const remotePeer = createPeer(false, data.playerId);
      remotePeer.signal(data.signal);
      playerPeers.current[data.playerId] = remotePeer;
    });

    //listen for answers and assign signals to their respective player ID's host peer
    onValue(answerRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      const key = data.playerId;
      playerPeers.current[key].signal(data.signal);
    });
  }, [playerId]);

  function createPeer(initiator: boolean, peerId: string) {
    const peer = new Peer({
      initiator,
      trickle: false,
    });

    peer.on("signal", async (signal) => {
      const params = new URLSearchParams({
        isInitiator: initiator.toString(),
        peerId,
        signalString: JSON.stringify(signal),
      }).toString();

      const data = await fetchApi(`/api/send-peer-signal?${params}`);
      const res = await data.json();
      if (res.error) {
        console.error(res.error);
      }
    });

    peer.on("connect", () => {
      peer.send(`connected to ${playerName}`);
    });

    peer.on("close", () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`disconnected from ${peerId}`);
      }
      delete playerPeers.current[peerId];
    });

    peer.on("error", (error) => {
      if (process.env.NODE_ENV === "development") {
        console.log(error.message);
      }
    });

    peer.on("data", (data) => {
      if (data instanceof Uint8Array) {
        const decodedData = new TextDecoder().decode(data);
        console.log(decodedData);
      } else {
        console.log(data);
      }
    });

    return peer;
  }

  return { playerPeers };
}
