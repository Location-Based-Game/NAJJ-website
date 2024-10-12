"use client";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "../_main-menu/MainMenuPanel";
import YourTurnUI from "./_your-turn/YourTurnUI";

export default function GameUI() {
    const gameState = useSelector((state:RootState) => state.gameState)
    const currentTurn = useSelector((state:RootState) => state.currentTurn)

    switch (gameState.state) {
        case "Menu":
            return <MainMenuPanel />
        case "TurnsDiceRoll":
            return currentTurn === 0 ? <YourTurnUI /> : <></>
        case "Gameplay":
            return currentTurn === 0 ? <YourTurnUI /> : <></>
    }
}