"use client";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import MainMenuPanel from "../_main-menu/MainMenuPanel";
import YourTurnUI from "./YourTurnUI";

export default function GameUI() {
    const gameState = useSelector((state:RootState) => state.gameState)

    switch (gameState.state) {
        case "Menu":
            return <MainMenuPanel />
        case "TurnsDiceRoll":
            return <YourTurnUI />
        case "Gameplay":
            return <YourTurnUI />
    }
}