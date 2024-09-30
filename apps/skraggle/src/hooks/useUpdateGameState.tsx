import { setGameState } from "@/state/GameStateSlice";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useUpdateGameState() {
  const dispatch = useDispatch()
  const handleUpdateGameState = useCallback((state: any) => {
    console.log(typeof state)
    dispatch(setGameState(state))
  }, []);

  useEffect(() => {
    addEventListener("UpdateGameState", handleUpdateGameState);

    return () => {
      removeEventListener("UpdateGameState", handleUpdateGameState);
    };

  }, [addEventListener, removeEventListener, handleUpdateGameState]);
}
