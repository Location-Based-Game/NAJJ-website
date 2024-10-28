import { useCallback, useEffect } from "react";
import { useUnityReactContext } from "./UnityContext";

export default function useSendBoardItemData() {
  const { playerPeers, addEventListener, removeEventListener } =
    useUnityReactContext();

  const handleSendData = useCallback((data: any) => {
    Object.keys(playerPeers.current).forEach(key => {
        if (!playerPeers.current[key].connected) return;
        playerPeers.current[key].send(data)
    })
  }, []);

  useEffect(() => {
    addEventListener("TransmitBoardItem", handleSendData);

    return () => {
      removeEventListener("TransmitBoardItem", handleSendData);
    };
  }, [addEventListener, removeEventListener, handleSendData]);
}
