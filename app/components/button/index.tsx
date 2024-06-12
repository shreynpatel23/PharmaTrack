import React from "react";
import { IButtonProps } from "./interface";
import Loading from "../loading";

export default function Button(props: IButtonProps) {
  const {
    buttonText,
    buttonClassName,
    hasIcon,
    icon,
    isDisabled,
    isLoading,
    onClick,
  } = props;
  return (
    <button
      type="button"
      className={`font-workSans font-medium flex items-center gap-4 px-4 py-2 transition-all ${buttonClassName}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {buttonText}
          {hasIcon && <>{icon}</>}
        </>
      )}
    </button>
  );
}
