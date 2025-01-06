import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ExpandPreviewButton() {
  const { sendMessage, addEventListener, removeEventListener } =
    useUnityReactContext();
  const [enableButton, setEnableButton] = useState(true);

  const handleShowButton = () => setEnableButton(true);

  useEffect(() => {
    addEventListener("ShowOtherPlayerPreviewButton", handleShowButton);

    return () => {
      removeEventListener("ShowOtherPlayerPreviewButton", handleShowButton);
    };
  }, [addEventListener, removeEventListener, handleShowButton]);

  return (
    <Button
      variant="ghost"
      onClick={() => {
        sendMessage("Receiver", "ExpandPreview");
        setEnableButton(false);
      }}
      disabled={!enableButton}
      className="pointer-events-auto absolute right-[2%] top-[2%] h-[17%] w-[17%] transition-opacity hover:bg-accent/20 disabled:opacity-0"
    ></Button>
  );
}
