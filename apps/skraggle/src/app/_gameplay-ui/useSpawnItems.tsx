import { RootState } from "@/store/store";
import { onChildAdded, onChildChanged, ref } from "firebase/database";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { Inventory } from "@types";
import { Item, itemSchema } from "@schemas/itemSchema";

/**
 * Listens for inventory/grid updates in the rtdb and spawns/deletes items
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
        SpawnPlayerItems(data);
      },
    );

    const inventoryChangedListener = onChildChanged(
      inventoriesRef,
      (newInventory) => {
        if (newInventory.key === null) return;
        const data = newInventory.val() as Inventory;
        SpawnPlayerItems(data);
      },
    );

    const gridRef = ref(rtdb, `activeGames/${gameId}/grid`);
    const gridItemAddedListener = onChildAdded(
      gridRef,
      (newItem) => {
        if (newItem.key === null) return;
        const data = newItem.val();
        const validatedData = itemSchema.parse(data);
        SpawnItem(validatedData as Item<any>);
      },
    );

    return () => {
      inventoryAddedListener();
      inventoryChangedListener();
      gridItemAddedListener();
    };
  }, [gameId, isGameActive]);

  function SpawnPlayerItems(inventory: Inventory) {
    Object.values(inventory).forEach((values) => {
      const validatedData = itemSchema.parse(values);
      SpawnItem(validatedData as Item<any>);
    });
  }

  function SpawnItem(item: Item<any>) {
    //timeout ensures items are spawned after players are instantiated
    setTimeout(() => {
      callUnityFunction("SpawnItem", {
        ...item,
        itemData:
          typeof item.itemData === "string"
            ? item.itemData
            : JSON.stringify(item.itemData),
      });
    }, 100);
  }
}
