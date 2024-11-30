import { RootState } from "@/store/store";
import { onChildAdded, onChildChanged, ref } from "firebase/database";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { Inventory } from "@types";

/**
* Listens for inventory updates in the rtdb and spawns/deletes items in the player inventories.
* TODO delete items
*/
export default function useSpawnItems() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { isGameActive } = useSelector((state: RootState) => state.gameState);
  const { callUnityFunction } = useUnityReactContext();

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
}
