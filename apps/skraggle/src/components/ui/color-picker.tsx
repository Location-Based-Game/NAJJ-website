"use client";

import { useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/tailwindUtils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onClose: () => void; 
}

const ColorPicker = ({
  disabled,
  value,
  onChange,
  onBlur,
  name,
  className,
  onClose,
  ...props
}: ColorPickerProps & ButtonProps) => {
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
     open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <Button
          {...props}
          className={cn("block", className)}
          name={name}
          onClick={() => {
            setOpen(true);
          }}
          size="icon"
          style={{
            backgroundColor: parsedValue,
          }}
          variant="outline"
        >
          <div />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <HexColorPicker color={parsedValue} onChange={onChange} />
        <Button
          className="mt-4 w-full"
          onClick={() => {
            onClose();
            setOpen(false);
          }}
        >
          Confirm
        </Button>
      </PopoverContent>
    </Popover>
  );
};

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
