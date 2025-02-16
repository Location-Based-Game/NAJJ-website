"use client";
import { BlankLetterInputView } from "@/app/_gameplay-ui/_your-turn/BlankLetterInput";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function BlankLetterInputFixture() {
  const trigger = useRef<HTMLSpanElement>(null!);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    trigger.current.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: event.clientX,
        clientY: event.clientY,
      }),
    );
  };

  return (
    <>
      <Button onClick={handleMenuOpen}>Open Context Menu</Button>
      <BlankLetterInputView ref={trigger} onChange={() => {}}/>
    </>
  );
}
