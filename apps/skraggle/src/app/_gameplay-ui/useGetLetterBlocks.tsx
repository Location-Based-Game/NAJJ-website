import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import { useCallback, useEffect } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { SetInventorySchemaType } from "../../../functions/src/endpoints/setInventory";

export default function useGetLetterBlocks() {
  const { addEventListener, removeEventListener } = useUnityReactContext();
  const { logOutOnError } = useLogOut();
  const { gameId, playerId } = useSelector((state: RootState) => state.logIn);
  const handleSendData = useCallback(() => {
    const body: SetInventorySchemaType = {
      currentItems: {},
      gameId,
      playerId,
    };

    fetchApi("setInventory", body).catch((error) => {
      logOutOnError(error);
    });
  }, [gameId, playerId]);

  useEffect(() => {
    addEventListener("FetchFirstLetterBlocks", handleSendData);

    return () => {
      removeEventListener("FetchFirstLetterBlocks", handleSendData);
    };
  }, [addEventListener, removeEventListener, handleSendData]);
}
