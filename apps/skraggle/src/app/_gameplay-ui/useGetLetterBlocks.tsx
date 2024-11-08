import useLogOutOnError from "@/hooks/useLogOutOnError";
import { fetchApi } from "@/lib/fetchApi";
import { useCallback, useEffect, useRef } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { PlayersData, useGetPlayers } from "@/components/GetPlayers";

export default function useGetLetterBlocks() {
  const { addEventListener, removeEventListener, callUnityFunction } =
    useUnityReactContext();
  const { playerData } = useGetPlayers();

  const firstFetch = useRef<"true" | "false">("true");
  const { logOutOnError } = useLogOutOnError();

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

  useEffect(() => {
    if (firstFetch.current === "true") return;    
    Object.keys(playerData).forEach((key) => {
      AddItem(playerData, key);
    });
  }, [playerData, firstFetch.current]);

  function AddItem(players: PlayersData, key: string) {
    const inventory = players[key].inventory;
    if (!inventory) return;
    Object.keys(inventory).forEach((itemId) => {
      callUnityFunction("SpawnLetterBlock", {
        playerId: key,
        itemId,
        letter: inventory[itemId].data,
      });
    });
  }
}
