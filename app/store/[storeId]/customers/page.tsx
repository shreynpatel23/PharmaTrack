"use client";
import Sidebar from "@/app/components/sidebar";
import React from "react";

export default function Customers() {
  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 bg-red-300"> hello from customers</div>
    </div>
  );
}
