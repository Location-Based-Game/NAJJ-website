import { forwardRef, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useUnityReactContext } from "@/app/_unity-player/UnityContext";
import { signal } from "@preact/signals-react";
import { z } from "zod";

const letterSignal = signal("");
const currentBlankLetterId = signal("");

const blankLetterParamsSchema = z.object({
  letter: z.string().length(1),
  id: z.string(),
});

type BlankLetterParams = z.infer<typeof blankLetterParamsSchema>;

export default function BlankLetterInput() {
  const trigger = useRef<HTMLSpanElement>(null!);
  const xPos = useRef<number>(0);
  const yPos = useRef<number>(0);
  const handleMousePos = (event: MouseEvent) => {
    xPos.current = event.clientX;
    yPos.current = event.clientY;
  };

  const handleMenuOpen = (letterData: any) => {
    const { letter, id } = blankLetterParamsSchema.parse(JSON.parse(letterData));
    letterSignal.value = letter;
    currentBlankLetterId.value = id;

    trigger.current.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: xPos.current,
        clientY: yPos.current,
      }),
    );
  };

  const { addEventListener, removeEventListener } = useUnityReactContext();

  useEffect(() => {
    document.addEventListener("mousemove", handleMousePos);
    addEventListener("ShowBlankLetterInputPopup", handleMenuOpen);
    return () => {
      document.removeEventListener("mousemove", handleMousePos);
      removeEventListener("ShowBlankLetterInputPopup", handleMenuOpen);
    };
  }, []);

  return (
    <>
      <BlankLetterInputView ref={trigger} />
    </>
  );
}

const BlankLetterInputView = forwardRef<HTMLSpanElement>(({}, ref) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger ref={ref} />
      <ContextMenuContent className="w-[12rem]">
        <BlankLetterInputViewContent />
      </ContextMenuContent>
    </ContextMenu>
  );
});

BlankLetterInputView.displayName = "BlankLetterInputView";
export { BlankLetterInputView };

function BlankLetterInputViewContent() {
  const input = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    input.current.focus();
    input.current.value = letterSignal.value.replaceAll(" ", "");
  }, []);

  const { callUnityFunction } = useUnityReactContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lastLetter = e.target.value[e.target.value.length - 1]
    if (lastLetter && !lastLetter.match(/^[A-Za-z]+$/)) {
      e.target.value = e.target.value.replace(lastLetter, "");
      return;
    }
    const data: BlankLetterParams = {
      letter: lastLetter ? lastLetter.toUpperCase() : " ",
      id: currentBlankLetterId.value,
    };
    input.current.value = data.letter;
    callUnityFunction("SetBlankLetter", data);
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <h2 className="text-center text-white drop-shadow-dark">
        Enter Custom Letter
      </h2>
      <Input
        ref={input}
        className="bg-black/50 text-center text-lg"
        maxLength={2}
        onChange={handleChange}
      />
    </div>
  );
}
