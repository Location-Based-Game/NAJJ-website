"use client";

import { cn } from "@/lib/tailwindUtils";
import panelStyles from "@styles/panel.module.css";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export default function JoinGameOTP() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div
        className={cn("relative", panelStyles.woodBorder)}
        style={{ width: "30rem" }}
      >
        <div className={panelStyles.woodBackground}></div>
        <div className="h-full w-full p-8 flex justify-center">
          <InputOTP
            id="join-code"
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            inputMode="text"
            autoCapitalize="none"
            spellCheck="false"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
    </div>
  );
};
