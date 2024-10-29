"use client";

import { useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/tailwindUtils";

type ColorPickerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  onColorChange: (value: string) => void;
  onBlur?: () => void;
  onClose: () => void;
};

const ColorPicker = ({
  value,
  onColorChange,
  onBlur,
  onClose,
  className,
  ...props
}: ColorPickerProps) => {
  const [open, setOpen] = useState(false);

  const parsedValue = useMemo(() => {
    return value || "#FFFFFF";
  }, [value]);

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
        setOpen(open);
      }}
      open={open}
    >
      <PopoverTrigger asChild disabled={props.disabled} onBlur={onBlur}>
        <Button
          {...props}
          className={cn("block", className)}
          onClick={() => {
            setOpen(true);
          }}
          size="icon"
          style={{
            backgroundColor: parsedValue,
          }}
          variant="outline"
        ></Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <HexColorPicker color={parsedValue} onChange={(color) => onColorChange(color)} />
      </PopoverContent>
    </Popover>
  );
};
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
