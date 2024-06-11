import React from "react";
import { IInputProps } from "./interface";

export default function Input(props: IInputProps) {
  const {
    error,
    hasError,
    hasHelperText,
    helperText,
    label,
    hasLabel,
    className,
    disabled,
  } = props;
  return (
    <div className="py-2">
      {hasLabel && (
        <label
          htmlFor={label}
          className="block text-base leading-4 font-medium text-heading mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={label}
        className={`w-full px-4 py-2 mb-2 outline-none bg-white border placeholder:text-sm placeholder:text-grey ${
          hasError ? "border-error" : "border-grey"
        } rounded-md ${className} ${
          disabled ? "cursor-not-allowed bg-[rgba(175,176,178,0.2)]" : null
        }`}
        {...props}
      />
      {hasError ? (
        <p className="text-error text-sm font-medium">{error}</p>
      ) : hasHelperText ? (
        <p className="text-heading text-sm font-medium">{helperText}</p>
      ) : null}
    </div>
  );
}
