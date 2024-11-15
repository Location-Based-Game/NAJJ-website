import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import { useCallback, useEffect } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { setInventory } from "@/firebase-actions/setInventory";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function useGetLetterBlocks() {
  const { addEventListener, removeEventListener } =
    useUnityReactContext();
  const { logOutOnError } = useLogOut();
  const {gameId, playerId} = useSelector((state:RootState) => state.logIn)
  const handleSendData = useCallback(() => {
    // const params = new URLSearchParams({
    //   amount: "7",
    //   clearInventory: "true"
    // }).toString();

    // fetchApi(`/api/get-letterblock?${params}`).catch((error) => {
    //   logOutOnError(error);
    // });
    setInventory({}, true, gameId, playerId)
  }, []);

  useEffect(() => {
    addEventListener("FetchFirstLetterBlocks", handleSendData);

    return () => {
      removeEventListener("FetchFirstLetterBlocks", handleSendData);
    };
  }, [addEventListener, removeEventListener, handleSendData]);
}
