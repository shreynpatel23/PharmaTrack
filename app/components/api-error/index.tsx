import React from "react";

export default function ApiError({ errorMessage }: { errorMessage: string }) {
  return <p className="text-error text-sm font-medium py-2">{errorMessage}</p>;
}
