"use client"
import { setGameState } from "@/state/GameStateSlice";
import { setTurnNumber } from "@/state/TurnSlice";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { UnityContextHook } from "react-unity-webgl/distribution/types/unity-context-hook";

export default function useUpdateGameState(unityContext:UnityContextHook) {
const {addEventListener, removeEventListener} = unityContext

  const dispatch = useDispatch()
  const handleUpdateGameState = useCallback((state: any) => {
    console.log(state)
    // dispatch(setGameState(state))
  }, []);

  // const handleUpdateTurn = useCallback((currentTurn: any) => {
  //   dispatch(setTurnNumber(currentTurn))
  // }, [])

  useEffect(() => {
    addEventListener("UpdateGameState", handleUpdateGameState);
    // addEventListener("UpdateTurn", handleUpdateTurn);

    return () => {
      removeEventListener("UpdateGameState", handleUpdateGameState);
      // removeEventListener("UpdateTurn", handleUpdateTurn);
    };

  }, [addEventListener, removeEventListener, handleUpdateGameState]);
}
