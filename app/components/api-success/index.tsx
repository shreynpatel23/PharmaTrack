"use client";
import React, { useState, useEffect } from "react";

export default function ApiSuccess({
  message,
  setMessage,
}: {
  message: string;
  setMessage: (value: string) => void;
}) {
  const [displayClass, setDisplayClass] = useState("block");

  useEffect(() => {
    setTimeout(() => {
      setDisplayClass("hidden");
      setMessage("");
    }, 3000);
  }, []);
  return (
    <p className={`text-success text-sm font-medium py-2 ${displayClass}`}>
      {message}
    </p>
  );
}
