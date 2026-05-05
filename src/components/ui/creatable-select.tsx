import * as React from "react";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export type CreatableSelectOption = {
  value: string;
  label: string;
  color?: string;
};

interface CreatableSelectProps {
  options: CreatableSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const CreatableSelect = React.forwardRef<HTMLDivElement, CreatableSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "검색 혹은 입력",
      className,
      disabled,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value ?? "");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      setInputValue(value ?? "");
    }, [value]);

    const filtered = options.filter(
      (o) =>
        !inputValue || o.label.toLowerCase().includes(inputValue.toLowerCase()),
    );

    const selectedOption = options.find(
      (o) => o.label.toLowerCase() === inputValue.trim().toLowerCase(),
    );

    const exactMatch = !!selectedOption;

    const handleSelect = (option: CreatableSelectOption) => {
      setInputValue(option.label);
      setOpen(false);
      onChange?.(option.label);
    };

    const handleCreate = () => {
      setOpen(false);
      onChange?.(inputValue.trim());
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      setInputValue("");
      setOpen(false);
      onChange?.("");
      inputRef.current?.focus();
    };

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setOpen(false);
          }
        }}
      >
        {/* Input */}
        <div className="relative flex items-center">
          <Input
            ref={inputRef}
            disabled={disabled}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            className="pr-8"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {inputValue && (
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={handleClear}
                className="cursor-pointer rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <X className="size-3.5" />
              </button>
            )}
            {!open && (
              <ChevronDown className="pointer-events-none size-4 text-muted-foreground transition-transform duration-150" />
            )}
          </div>
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
            <ScrollArea className="max-h-60">
              <div className="min-w-0 max-w-50 p-1">
                {filtered.length === 0 && !inputValue.trim() && (
                  <p className="px-2 py-1.5 text-sm text-muted-foreground">
                    라벨을 입력하세요
                  </p>
                )}

                {filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    tabIndex={0}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent",
                      selectedOption?.value === option.value &&
                        "font-medium text-foreground",
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(option);
                    }}
                  >
                    {option.color ? (
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                    ) : (
                      <span className="size-3 shrink-0" />
                    )}
                    <span className="flex-1 text-left">{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </button>
                ))}

                {inputValue.trim() && !exactMatch && (
                  <>
                    {filtered.length > 0 && <Separator className="my-1" />}
                    <button
                      type="button"
                      tabIndex={0}
                      className="flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleCreate();
                      }}
                    >
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        생성
                      </Badge>
                      <span className="min-w-0 truncate ">
                        "{inputValue.trim()}"
                      </span>
                    </button>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    );
  },
);

CreatableSelect.displayName = "CreatableSelect";

export { CreatableSelect };
