"use client";
import { setGameState } from "@/store/gameStateSlice";
import { GameStates } from "@types";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { UnityContextHook } from "react-unity-webgl/distribution/types/unity-context-hook";

export default function useUpdateGameState(unityContext: UnityContextHook) {
  const { addEventListener, removeEventListener } = unityContext;

  const dispatch = useDispatch();
  const handleUpdateGameState = useCallback((state: any) => {
    dispatch(setGameState(state as GameStates));
  }, []);

  useEffect(() => {
    addEventListener("UpdateGameState", handleUpdateGameState);

    return () => {
      removeEventListener("UpdateGameState", handleUpdateGameState);
    };
  }, [addEventListener, removeEventListener, handleUpdateGameState]);
}
