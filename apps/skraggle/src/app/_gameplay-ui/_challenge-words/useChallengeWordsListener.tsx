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
import { challengeWordSchema } from "@schemas/challengeWordSchema";
import { useGameplayUIContext } from "../GameplayUIContextProvider";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";

export default function useChallengeWordsListener() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
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
