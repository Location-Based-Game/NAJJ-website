"use client";
import { rtdb } from "@/app/firebaseConfig";
import { addInitialStatus } from "@/store/peerStatusSlice";
import { RootState } from "@/store/store";
import {
  ref,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  DataSnapshot,
} from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlayer,
  removePlayer,
  removeAllPlayers,
  type PlayerData,
} from "@/store/playersSlice";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

export default function usePlayersData() {
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const { callUnityFunction } = useUnityReactContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameId) {
      dispatch(removeAllPlayers());
      return;
    }
    const playersRef = ref(rtdb, `activeGames/${gameId}/players`);

    const addPlayerListener = onChildAdded(playersRef, (newPlayer) => {
      if (newPlayer.key === null) return;
      dispatch(
        addPlayer({ key: newPlayer.key, value: newPlayer.val() as PlayerData }),
      );
      dispatch(addInitialStatus(newPlayer.key));
    });

    const playerChangedListener = onChildChanged(
      playersRef,
      handleChangedPlayerData,
    );

    const removePlayerListener = onChildRemoved(playersRef, (removedPlayer) => {
      if (removedPlayer.key === null) return;
      dispatch(removePlayer(removedPlayer.key));
    });

    return () => {
      addPlayerListener();
      playerChangedListener();
      removePlayerListener();
    };
  }, [gameId]);

  function handleChangedPlayerData(changedPlayer: DataSnapshot) {
    if (changedPlayer.key === null) return;

    const data = changedPlayer.val() as PlayerData;
    dispatch(
      addPlayer({
        key: changedPlayer.key,
        value: data,
      }),
    );

    if (data.turn !== null) {
      callUnityFunction("AddPlayer", {
        turn: data.turn,
        playerId: changedPlayer.key,
        playerName: data.name,
        color: data.color,
        isMainPlayer: changedPlayer.key === playerId,
      });
    }
  }
}
