import { RootState } from "@/store/store";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
} from "firebase/database";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { rtdb } from "../../firebaseConfig";
import { challengeWordSchema } from "@schemas/challengerSchema";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

export default function useChallengeWordsListener() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const {currentTurn, playerTurn} = useSelector((state: RootState) => state.turnState);
  const { setChallengeWords } = useGameplayUIContext();
  const { callUnityFunction } = useUnityReactContext();

  useEffect(() => {
    if (!gameId) {
      setChallengeWords({});
      return;
    }
    const challengeWordsRef = ref(rtdb, `activeGames/${gameId}/challengeWords/words`);
    const addWordListener = onChildAdded(challengeWordsRef, (newWord) => {
      if (newWord.key === null) return;
      const data = challengeWordSchema.safeParse(newWord.val());
      if (!data.success) return;
      setChallengeWords((prev) => {
        return { ...prev, [newWord.key!]: data.data };
      });

      // If the player is on multiple tabs, this will prevent the player
      // from placing more letters when the words(s) is submitted
      if (currentTurn === playerTurn) {
        callUnityFunction("InvokeOnCurrentItemsSent")
      }
    });

    const updateWordListener = onChildChanged(
      challengeWordsRef,
      (changedWord) => {
        if (changedWord.key === null) return;
        const data = challengeWordSchema.safeParse(changedWord.val());
        if (!data.success) return;
        setChallengeWords((prev) => {
          return { ...prev, [changedWord.key!]: data.data };
        });
        callUnityFunction("PlayChallengeWordSound");
      },
    );

    //remove all challenge words if a word is removed
    const removeWordListener = onChildRemoved(challengeWordsRef, () => {
      setChallengeWords({});
    });

    return () => {
      addWordListener();
      updateWordListener();
      removeWordListener();
    };
  }, [gameId]);
}
