"use client";
import { rtdb } from "@/app/firebaseConfig";
import { addInitialStatus } from "@/store/peerStatusSlice";
import { RootState } from "@/store/store";
import {
  ref,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
} from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPlayer,
  removePlayer,
  removeAllPlayers,
} from "@/store/playersSlice";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { setPlayerTurn } from "@/store/turnSlice";
import { PlayerData } from "@types";

export default function usePlayersData() {
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
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
      const data = newPlayer.val() as PlayerData;

      dispatch(addPlayer({ key: newPlayer.key, value: data }));
      dispatch(addInitialStatus(newPlayer.key));
      AddPlayer(data, newPlayer.key);
    });

    const playerChangedListener = onChildChanged(
      playersRef,
      (changedPlayer) => {
        if (changedPlayer.key === null) return;
        const data = changedPlayer.val() as PlayerData;
        dispatch(
          addPlayer({
            key: changedPlayer.key,
            value: data,
          }),
        );
        AddPlayer(data, changedPlayer.key);
      },
    );

    const removePlayerListener = onChildRemoved(playersRef, (removedPlayer) => {
      if (removedPlayer.key === null) return;
      dispatch(removePlayer(removedPlayer.key));

      if (removedPlayer.key !== playerId && isGameActive) {
        callUnityFunction("RemovePlayer", removedPlayer.key);
      }
    });

    return () => {
      addPlayerListener();
      playerChangedListener();
      removePlayerListener();
    };
  }, [gameId, isGameActive]);

  function AddPlayer(data: PlayerData, key: string) {
    if (!isGameActive) return;
    if (data.turn === null) return;
    const isMainPlayer = key === playerId;

    callUnityFunction("AddPlayer", {
      turn: data.turn,
      playerId: key,
      playerName: data.name,
      color: data.color,
      isMainPlayer,
    });

    if (isMainPlayer) {
      dispatch(setPlayerTurn(data.turn));
    }
  }
}
