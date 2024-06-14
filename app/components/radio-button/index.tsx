import React from "react";

export default function RadioButton({
  buttonText,
  isActive,
  onClick,
}: {
  buttonText?: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`px-4 py-2 rounded-[16px] hover:bg-orange flex items-center gap-3 group ${
        isActive ? "bg-orange" : "bg-transparent "
      }`}
      onClick={onClick}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isActive ? "bg-accent" : "bg-grey"
        }`}
      >
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>
      <p
        className={`text-base leading-base ${
          isActive ? "text-accent font-bold" : "text-black"
        }`}
      >
        {buttonText}
      </p>
    </button>
  );
}
