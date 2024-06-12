import React from "react";
import Loading from "../loading";

export default function FullPageLoading({
  wrapperClassName,
  message,
}: {
  wrapperClassName: string;
  message: string;
}) {
  return (
    <div className={wrapperClassName}>
      <div className="flex flex-col items-center gap-4">
        <div className="p-4">
          <Loading />
        </div>
        <p className="text-sm leading-5 font-medium text-black text-center">
          {message}
        </p>
      </div>
    </div>
  );
}
