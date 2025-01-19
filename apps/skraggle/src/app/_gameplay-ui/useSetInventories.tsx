import { useCallback, useEffect, useRef } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import {
  CurrentItemsType,
  currentItemsSchema,
} from "@schemas/currentItemsSchema";
import { fetchApi } from "@/lib/fetchApi";
import useLogOut from "@/hooks/useLogOut";

/**
 * Listens for events in the Unity instance to update inventory in rtdb
 */
export default function useSetInventories() {
  const { addEventListener, removeEventListener, callUnityFunction } =
    useUnityReactContext();
  const { logOutOnError } = useLogOut();

  const getCurrentItemsResolve = useRef<(value: CurrentItemsType) => void>();
  const currentItemsRef = useRef<CurrentItemsType | null>(null);

  const getCurrentItems = async () => {
    const promise = new Promise<CurrentItemsType>((resolve) => {
      getCurrentItemsResolve.current = resolve;
    });
    callUnityFunction("SendInventoryData");
    await promise;
    return currentItemsRef.current!;
  };

  const getCurrentItemsFromUnity = useCallback((json: any) => {
    const data = {
      currentItems: json ? JSON.parse(json) : {},
    };
    const currentItems = currentItemsSchema.parse(data);
    if (getCurrentItemsResolve.current === undefined) return;
    currentItemsRef.current = currentItems;
    getCurrentItemsResolve.current(currentItems);
  }, []);

  const updateInventory = useCallback((json: any) => {
    const data = {
      currentItems: json ? JSON.parse(json) : {},
    };
    const { currentItems } = currentItemsSchema.parse(data);
    fetchApi("setInventory", { currentItems }).catch((error) => {
      logOutOnError(error);
    });
  }, []);

  useEffect(() => {
    addEventListener("UpdateInventory", updateInventory);
    addEventListener("SendCurrentItems", getCurrentItemsFromUnity);

    return () => {
      removeEventListener("UpdateInventory", updateInventory);
      removeEventListener("SendCurrentItems", getCurrentItemsFromUnity);
    };
  }, [
    addEventListener,
    removeEventListener,
    updateInventory,
    getCurrentItemsFromUnity,
  ]);

  return { getCurrentItems };
}
