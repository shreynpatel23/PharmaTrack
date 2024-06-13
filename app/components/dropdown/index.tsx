import React from "react";
import { IDropdownProps } from "./interface";

export default function Dropdown(props: IDropdownProps) {
  const { id, label, onClick, options, selectedOption, hasError, error } =
    props;
  return (
    <div className="py-2">
      <label
        htmlFor={id}
        className="block text-base leading-4 font-medium text-heading mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        className={`w-full px-4 py-2 mb-2 outline-none bg-white border placeholder:text-sm placeholder:text-grey rounded-md ${
          hasError ? "border-error" : "border-grey"
        }`}
        value={selectedOption.name ?? "Select Role"}
        onChange={(event) => {
          const selectedOption = options.find(
            (option) =>
              option.name.toLowerCase() === event.target.value.toLowerCase()
          ) || {
            id: "",
            name: "",
          };
          onClick(selectedOption);
        }}
      >
        {options.map((option) => (
          <option
            key={option.id}
            value={option.name}
            className={`text-sm leading-4 ${
              option.name.toLowerCase() === selectedOption.name.toLowerCase()
                ? "text-accent font-medium"
                : "text-heading"
            }`}
          >
            {option.name}
          </option>
        ))}
      </select>
      {hasError ? (
        <p className="text-error text-sm font-medium">{error}</p>
      ) : null}
    </div>
  );
}
