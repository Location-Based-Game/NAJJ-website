import { useCallback, useEffect } from "react";

export default function useUpdateGameState() {
  const handleUpdateGameState = useCallback((state: any) => {
    console.log(state);
  }, []);

  useEffect(() => {
    addEventListener("UpdateGameState", handleUpdateGameState);

    return () => {
      removeEventListener("UpdateGameState", handleUpdateGameState);
    };

  }, [addEventListener, removeEventListener, handleUpdateGameState]);
}
