import { useCallback, useEffect } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { playerPeers } from "../_unity-player/useWebRTC";

export default function useSendBoardItemData() {
  const { addEventListener, removeEventListener } = useUnityReactContext();

  const handleSendData = useCallback((data: any) => {
    Object.keys(playerPeers.value).forEach((key) => {
      if (!playerPeers.value[key].connected) return;
      playerPeers.value[key].send(data);
    });
  }, []);

  useEffect(() => {
    addEventListener("TransmitBoardItem", handleSendData);

    return () => {
      removeEventListener("TransmitBoardItem", handleSendData);
    };
  }, [addEventListener, removeEventListener, handleSendData]);
}
