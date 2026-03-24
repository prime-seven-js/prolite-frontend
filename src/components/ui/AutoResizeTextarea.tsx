import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

/**
 * AutoResizeTextarea — textarea tự động nới rộng khi nội dung dài.
 */

interface AutoResizeTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  showCounter?: boolean;
  counterClassName?: string;
}

export const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  AutoResizeTextareaProps
>(
  (
    {
      value,
      onChange,
      maxLength,
      showCounter = false,
      counterClassName,
      className,
      rows = 1,
      ...props
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    // Auto-resize textarea khi value thay đổi
    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    // Chặn input khi vượt maxLength
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (maxLength && newValue.length > maxLength) return;
      onChange(newValue);
    };

    // Tính toán màu sắc bộ đếm ký tự
    const charCount = value.length;
    const getCounterColor = () => {
      if (!maxLength) return "text-gray-500";
      const ratio = charCount / maxLength;
      if (ratio >= 1) return "text-red-400";
      if (ratio >= 0.8) return "text-amber-400";
      return "text-gray-500";
    };

    return (
      <div className="relative w-full">
        <textarea
          ref={internalRef}
          value={value}
          onChange={handleChange}
          rows={rows}
          className={cn(
            "resize-none overflow-hidden",
            className,
          )}
          {...props}
        />
        {showCounter && maxLength && (
          <div
            className={cn(
              "text-right text-xs mt-1 transition-colors",
              getCounterColor(),
              counterClassName,
            )}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    );
  },
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
