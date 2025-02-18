import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { challengeWordRecordSchema } from "@schemas/challengerSchema";
import { WordData } from "@schemas/wordDataSchema";
import { useAnimate } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { z } from "zod";

const wordsJsonSchema = z.object({
    wordsData: challengeWordRecordSchema,
    validationType: z.custom<LetterPosValidation>(),
    isItemDropped: z.boolean(),
  })

export default function useGetValidatedWord() {
  const [enableButton, setEnableButton] = useState(true);
  const { addEventListener, removeEventListener } = useUnityReactContext();
  const [buttonLabel, setButtonLabel] =
    useState<ButtonLabels>("No letters placed");
  const [scopeLabel, animateLabel] = useAnimate();
  const [wordsData, setWordsData] = useState<Record<string, WordData>>({});

  const setButtonState = useCallback(
    (json: any) => {
      const data = wordsJsonSchema.parse(JSON.parse(json));
      if (!data.isItemDropped) {
        setEnableButton(false);
        return;
      } else if (data.validationType === LetterPosValidation.Valid) {
        setEnableButton(true);
        setWordsData(data.wordsData);
      } else {
        setWordsData({});
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

  return { enableButton, setEnableButton, scopeLabel, buttonLabel, wordsData };
}

enum LetterPosValidation {
  Valid,
  NoBlocksPlaced,
  NotAligned,
  NotAdjacent,
  NotConnected,
  NotOnCenter,
}

export type ButtonLabels =
  | "End Turn"
  | "No letters placed"
  | "Letters not aligned"
  | "Letters must be adjacent"
  | "Word must be connected to an existing letter"
  | "At least 1 letter must be on the center";
