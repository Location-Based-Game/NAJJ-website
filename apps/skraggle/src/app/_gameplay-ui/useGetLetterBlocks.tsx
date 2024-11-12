import useLogOut from "@/hooks/useLogOut";
import { fetchApi } from "@/lib/fetchApi";
import { useCallback, useEffect, useRef } from "react";
import { useUnityReactContext } from "../_unity-player/UnityContext";
import { PlayersData, useGetPlayers } from "@/components/PlayersDataProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function useGetLetterBlocks() {
  const { addEventListener, removeEventListener, callUnityFunction } =
    useUnityReactContext();
  const { playerData } = useGetPlayers();
  const { gameId } = useSelector((state: RootState) => state.logIn);

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

  useEffect(() => {
    if (!gameId) {
      firstFetch.current === "true";
      return;
    }
    if (firstFetch.current === "true") return;
    Object.keys(playerData).forEach((key) => {
      AddItem(playerData, key);
    });
  }, [playerData, gameId]);

  function AddItem(players: PlayersData, key: string) {
    const inventory = players[key].inventory;
    if (!inventory) return;
    Object.keys(inventory).forEach((itemId) => {
      callUnityFunction("SpawnItem", {
        playerId: key,
        itemId,
        data: JSON.stringify(inventory[itemId].data),
        type: inventory[itemId].type,
      });
    });
  }
}
