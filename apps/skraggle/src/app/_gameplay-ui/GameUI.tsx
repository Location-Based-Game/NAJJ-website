"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "../_main-menu/_home/MainMenuPanel";
import YourTurnUI from "./_your-turn/YourTurnUI";
import { useGetPlayers } from "@/components/GetPlayers";
import useSendBoardItemData from "../_unity-player/useSendBoardItemData";
import useStartingDice from "../_unity-player/useStartingDice";

export default function GameUI() {
    const gameState = useSelector((state:RootState) => state.gameState)
    const currentTurn = useSelector((state:RootState) => state.currentTurn)
    const { playerData } = useGetPlayers();
    useStartingDice(playerData);
    useSendBoardItemData();
    
    switch (gameState.state) {
        case "Menu":
            return <MainMenuPanel />
        case "TurnsDiceRoll":
            return currentTurn === 0 ? <YourTurnUI /> : <></>
        case "Gameplay":
            return currentTurn === 0 ? <YourTurnUI /> : <></>
    }
}