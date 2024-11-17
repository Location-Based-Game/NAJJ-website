import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import { useCallback, useEffect } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { SetInventorySchemaType } from "../../../functions/src/endpoints/setInventory";

export default function useGetLetterBlocks() {
  const { addEventListener, removeEventListener } =
    useUnityReactContext();
  const { logOutOnError } = useLogOut();
  const {gameId, playerId} = useSelector((state:RootState) => state.logIn)
  const handleSendData = useCallback(() => {
    const body:SetInventorySchemaType = {
      currentItems: {},
      gameId,
      playerId,
    };

    (async () => {
      try {
        const data = await fetch("http://localhost:5001/skraggle-2e19f/us-central1/setInventory", {
          method: "POST",
          body: JSON.stringify(body),
          credentials: "include"
        })
        const res = await data.json()
        if (res.error) {
          throw new Error(res.error);
        }
      } catch (error) {
        console.error(`${error}`)
      }
    })()

  }, [gameId, playerId]);

  useEffect(() => {
    addEventListener("FetchFirstLetterBlocks", handleSendData);

    return () => {
      removeEventListener("FetchFirstLetterBlocks", handleSendData);
    };
  }, [addEventListener, removeEventListener, handleSendData]);
}
