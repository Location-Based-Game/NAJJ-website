import { RootState } from "@/store/store";
import {
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  ref,
} from "firebase/database";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { rtdb } from "../firebaseConfig";
import { challengeWordSchema } from "@schemas/challengeWordSchema";
import { useGameplayUIContext } from "./GameplayUIContextProvider";

export default function useChallengeWordsListener() {
  const { gameId } = useSelector((state: RootState) => state.logIn);
  const { setChallengeWords } = useGameplayUIContext();

  useEffect(() => {
    if (!gameId) {
      setChallengeWords({});
      return;
    }
    const challengeWordsRef = ref(rtdb, `activeGames/${gameId}/challengeWords/words`);
    const addWordListener = onChildAdded(challengeWordsRef, (newWord) => {
      if (newWord.key === null) return;
      const data = challengeWordSchema.parse(newWord.val());
      setChallengeWords((prev) => {
        return { ...prev, [newWord.key!]: data };
      });
    });

    const updateWordListener = onChildChanged(
      challengeWordsRef,
      (changedWord) => {
        if (changedWord.key === null) return;
        const data = challengeWordSchema.parse(changedWord.val());
        setChallengeWords((prev) => {
          return { ...prev, [changedWord.key!]: data };
        });
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
