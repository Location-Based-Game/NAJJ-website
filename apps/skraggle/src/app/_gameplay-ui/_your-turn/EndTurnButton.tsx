import { Button } from "@/components/ui/button";
import { useCallback, useContext, useEffect, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import { GamePlayUIContext } from "../GameUI";
import { fetchApi } from "@/lib/fetchApi";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

type WordsJsonData = {
  words: string[];
  validationType: LetterPosValidation;
  isItemDropped: boolean;
};

const MotionButton = motion.create(Button);

export default function EndTurnButton() {
  const [enableButton, setEnableButton] = useState(true);
  const showUI = useContext(GamePlayUIContext);
  const { addEventListener, removeEventListener } = useUnityReactContext();
  const [buttonLabel, setButtonLabel] =
    useState<ButtonLabels>("No letters placed");
  const [scopeLabel, animateLabel] = useAnimate();

  const setButtonState = useCallback(
    (json: any) => {
      const data = JSON.parse(json) as WordsJsonData;
      if (!data.isItemDropped) {
        setEnableButton(false);
        return;
      } else if (data.validationType === LetterPosValidation.Valid) {
        setEnableButton(true);
      }

      switch (data.validationType) {
        case LetterPosValidation.NoBlocksPlaced:
          animateButton("No letters placed");
          break;
        case LetterPosValidation.NotAdjacent:
          animateButton("Letters must be adjacent");
          break;
        case LetterPosValidation.NotAligned:
          animateButton("Letters not aligned");
          break;
        case LetterPosValidation.NotConnected:
          animateButton("Word must be connected to an existing letter");
          break;
        case LetterPosValidation.NotOnCenter:
          animateButton("At least 1 letter must be on the center");
          break;
        case LetterPosValidation.Valid:
          animateButton("End Turn");
          break;
      }
    },
    [buttonLabel],
  );

  const animateButton = async (label: ButtonLabels) => {
    if (buttonLabel === label) return;
    await animateLabel(
      scopeLabel.current,
      {
        opacity: 0,
      },
      {
        duration: 0.2,
        onComplete: () => {
          setButtonLabel(label);
        },
      },
    );
    await animateLabel(
      scopeLabel.current,
      {
        opacity: 1,
      },
      { duration: 0.2, delay: 0.2 },
    );
  };

  useEffect(() => {
    addEventListener("SendValidatedWords", setButtonState);
    return () => {
      removeEventListener("SendValidatedWords", setButtonState);
    };
  }, [addEventListener, removeEventListener, setButtonState]);

  const handleEndTurn = async () => {
    await fetchApi("endTurn");
  };

  return (
    showUI && (
      <MotionButton
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => {
          handleEndTurn();
          setEnableButton(false);
        }}
        layout
        transition={{ layout: { duration: 0.2 } }}
        className="absolute top-4 overflow-hidden disabled:bg-gray-500 disabled:opacity-100"
        disabled={!enableButton || buttonLabel != "End Turn"}
      >
        <span ref={scopeLabel}>{buttonLabel}</span>
      </MotionButton>
    )
  );
}

enum LetterPosValidation {
  Valid,
  NoBlocksPlaced,
  NotAligned,
  NotAdjacent,
  NotConnected,
  NotOnCenter,
}

type ButtonLabels =
  | "End Turn"
  | "No letters placed"
  | "Letters not aligned"
  | "Letters must be adjacent"
  | "Word must be connected to an existing letter"
  | "At least 1 letter must be on the center";