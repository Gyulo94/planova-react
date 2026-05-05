import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";

interface FilterButtonProps {
  label: string;
  count: number;
  active: boolean;
  children: React.ReactNode;
}

export default function FilterButton({
  label,
  count,
  active,
  children,
}: FilterButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`w-24 justify-center gap-1 transition-colors ${
            active ? "bg-primary/10 border-primary" : ""
          }`}
        >
          <span>{label}</span>
          {count > 0 && (
            <span className="text-xs font-semibold">({count})</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start" side="bottom">
        <PopoverHeader className="mb-3">
          <PopoverTitle className="text-sm">{label} 선택</PopoverTitle>
        </PopoverHeader>
        {children}
      </PopoverContent>
    </Popover>
  );
}
