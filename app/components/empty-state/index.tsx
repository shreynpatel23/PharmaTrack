import React from "react";
import Loading from "../loading";

export default function EmptyState({
  wrapperClassName,
}: {
  wrapperClassName: string;
}) {
  return (
    <div className={wrapperClassName}>
      <div className="flex flex-col items-center gap-4">
        <div className="p-4">
          <img
            src="/Empty-state.svg"
            alt="Empty State Illustration for empty results"
          />
        </div>
        <p className="text-lg leading-6 font-medium text-black text-center font-workSans">
          No Data to Display
        </p>
        <p className="text-sm leading-5 text-black text-center">
          Adjust your filters or try a different search to view the data here.
        </p>
      </div>
    </div>
  );
}
