import { useGameplayUIContext } from "../GameplayUIContextProvider";
import ChallengeWordsContainer from "./ChallengeWordsContainer";
import ExpandPreviewButton from "./ExpandPreviewButton";

export default function NotYourTurnUI() {
  const { challengeWords } = useGameplayUIContext();

  return Object.keys(challengeWords).length === 0 ? (
    <ExpandPreviewButton />
  ) : (
    <ChallengeWordsContainer />
  );
}
