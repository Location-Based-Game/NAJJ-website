import { RootState } from "@/store/store";
import { onChildAdded, onChildChanged, ref } from "firebase/database";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { Inventory } from "@/store/playersSlice";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";

export default function useInventories() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { callUnityFunction, addEventListener, removeEventListener } = useUnityReactContext();
  const { logOutOnError } = useLogOut();

  useEffect(() => {
    if (!gameId) return;
    const inventoriesRef = ref(rtdb, `activeGames/${gameId}/inventories`);
    const inventoryAddedListener = onChildAdded(
      inventoriesRef,
      (newInventory) => {
        if (newInventory.key === null) return;
        const data = newInventory.val() as Inventory;
        SpawnItems(data, newInventory.key);
      },
    );

    const inventoryChangedListener = onChildChanged(
      inventoriesRef,
      (newInventory) => {
        if (newInventory.key === null) return;
        const data = newInventory.val() as Inventory;
        SpawnItems(data, newInventory.key);
      },
    );

    return () => {
      inventoryAddedListener();
      inventoryChangedListener();
    };
  }, [gameId, isGameActive]);

  function SpawnItems(inventory: Inventory, key: string) {
    setTimeout(() => {
      Object.keys(inventory).forEach((itemId) => {
        const itemData = {
          playerId: key,
          itemId,
          data: JSON.stringify(inventory[itemId].data),
          type: inventory[itemId].type,
        };
        callUnityFunction("SpawnItem", itemData);
      });
    }, 100);
  }

  const updateInventory = useCallback((json:any) => {
    console.log(json)

    // fetchApi(`/api/get-letterblock?${params}`).catch((error) => {
    //   logOutOnError(error);
    // });
  }, []);

  useEffect(() => {
    addEventListener("UpdateInventory", updateInventory);

    return () => {
      removeEventListener("UpdateInventory", updateInventory);
    };
  }, [addEventListener, removeEventListener, updateInventory]);
}
