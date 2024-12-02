import { RootState } from "@/store/store";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";
import { SetInventorySchemaType } from "../../../functions/src/endpoints/setInventory";

/**
 * Listens for events in the Unity instance to update inventory in rtdb
 */
export default function useSetInventories() {
  const { addEventListener, removeEventListener } = useUnityReactContext();
  const { logOutOnError } = useLogOut();

  const updateInventory = useCallback(
    (json: any) => {
      const body: SetInventorySchemaType = {
        currentItems: json ? JSON.parse(json) : {},
      };
      fetchApi("setInventory", body).catch((error) => {
        logOutOnError(error);
      });
    },
    [],
  );

  useEffect(() => {
    addEventListener("UpdateInventory", updateInventory);
    addEventListener("FetchFirstLetterBlocks", updateInventory);

    return () => {
      removeEventListener("UpdateInventory", updateInventory);
      removeEventListener("FetchFirstLetterBlocks", updateInventory);
    };
  }, [addEventListener, removeEventListener, updateInventory]);
}
