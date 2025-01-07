import { useCallback, useEffect } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { playerPeers } from "./useWebRTC";

export default function useTransmitWebRTCData() {
  const { addEventListener, removeEventListener } = useUnityReactContext();

  const handleSendData = useCallback((data: any) => {
    Object.keys(playerPeers.value).forEach((key) => {
      if (!playerPeers.value[key].connected) return;
      playerPeers.value[key].send(data);
    });
  }, []);

  useEffect(() => {
    addEventListener("TransmitWebRTCData", handleSendData);

    return () => {
      removeEventListener("TransmitWebRTCData", handleSendData);
    };
  }, [addEventListener, removeEventListener, handleSendData]);
}
