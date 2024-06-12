import React from "react";

export default function SearchInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <div className="p-2 rounded-md border border-grey bg-white flex items-center gap-2">
      <div className="pl-2">
        <img
          src="/search.svg"
          alt="search icon for input"
          className="w-[20px]"
        />
      </div>
      <input
        type="text"
        className="px-2 bg-transparent flex-1 outline-none font-medium text-base text-heading placeholder:text-sm placeholder:font-medium placeholder:text-grey"
        {...props}
      />
    </div>
  );
}
