import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import { useCallback, useEffect, useRef } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";

export default function useGetLetterBlocks() {
  const { addEventListener, removeEventListener, callUnityFunction } =
    useUnityReactContext();

  const firstFetch = useRef<"true" | "false">("true");
  const { logOutOnError } = useLogOut();

  const handleSendData = useCallback((data: any) => {
    const params = new URLSearchParams({
      amount: data,
      clearInventory: firstFetch.current,
    }).toString();

    firstFetch.current = "false";

    fetchApi(`/api/get-letterblock?${params}`).catch((error) => {
      logOutOnError(error);
    });
  }, []);

  useEffect(() => {
    addEventListener("FetchLetterBlocks", handleSendData);

    return () => {
      removeEventListener("FetchLetterBlocks", handleSendData);
    };
  }, [addEventListener, removeEventListener, handleSendData]);
}
