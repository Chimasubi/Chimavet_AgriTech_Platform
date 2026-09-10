import * as React from "react";
import { cn } from "./utils";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
}

export function Slider({ value = [0], onValueChange, min = 0, max = 100, step = 1, className, ...props }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onValueChange?.([val]);
  };

  const val = value[0] ?? 0;
  const percentage = ((val - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
        {...props}
      />
    </div>
  );
}
