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
  const { addEventListener, removeEventListener, callUnityFunction } =
    useUnityReactContext();

  const trigger = useRef<HTMLSpanElement>(null!);
  const xPos = useRef<number>(0);
  const yPos = useRef<number>(0);
  const handlePointerPos = (event: MouseEvent) => {
    xPos.current = event.clientX;
    yPos.current = event.clientY;
  };

  const handleMenuOpen = (letterData: any) => {
    const { letter, id } = blankLetterParamsSchema.parse(
      JSON.parse(letterData),
    );
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

  const handleOnChange = (data: BlankLetterParams) => {
    callUnityFunction("SetBlankLetter", data);
  };

  const handleClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLCanvasElement) {
      document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  };

  useEffect(() => {
    // "pointermove" is used instead of "mousemove" to support both mouse and touch
    document.addEventListener("pointermove", handlePointerPos);
    document.addEventListener("pointerdown", handleClick);
    addEventListener("ShowBlankLetterInputPopup", handleMenuOpen);
    return () => {
      document.removeEventListener("pointermove", handlePointerPos);
      document.removeEventListener("pointerdown", handleClick);
      removeEventListener("ShowBlankLetterInputPopup", handleMenuOpen);
    };
  }, []);

  return (
    <>
      <BlankLetterInputView ref={trigger} onChange={handleOnChange} />
    </>
  );
}

type BlankLetterInputViewProps = {
  onChange: (data: BlankLetterParams) => void;
};

const BlankLetterInputView = forwardRef<
  HTMLSpanElement,
  BlankLetterInputViewProps
>(({ onChange }, ref) => {
  const contextMenuContentRef = useRef<HTMLDivElement>(null!);
  return (
    <ContextMenu>
      <ContextMenuTrigger ref={ref} />
      <ContextMenuContent
        ref={contextMenuContentRef}
        className="w-[12rem]"
        onInteractOutside={() => {
          contextMenuContentRef.current.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape" }),
          );
        }}
      >
        <BlankLetterInputViewContent onChange={onChange} />
      </ContextMenuContent>
    </ContextMenu>
  );
});

BlankLetterInputView.displayName = "BlankLetterInputView";
export { BlankLetterInputView };

interface BlankLetterInputViewContent {
  onChange: (data: BlankLetterParams) => void;
}

function BlankLetterInputViewContent({
  onChange,
}: BlankLetterInputViewContent) {
  const input = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    input.current.focus();
    input.current.value = letterSignal.value.replaceAll(" ", "");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lastLetter = e.target.value[e.target.value.length - 1];
    if (lastLetter && !lastLetter.match(/^[A-Za-z]+$/)) {
      e.target.value = e.target.value.replace(lastLetter, "");
      return;
    }
    const data: BlankLetterParams = {
      letter: lastLetter ? lastLetter.toUpperCase() : " ",
      id: currentBlankLetterId.value,
    };
    input.current.value = data.letter;
    onChange(data);
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
