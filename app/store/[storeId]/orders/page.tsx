"use client";
import Sidebar from "@/app/components/sidebar";
import { useStoreContext } from "@/context/storeContext";
import React from "react";

export default function Orders() {
  const { storeId } = useStoreContext();
  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 bg-red-300"> hello from orders : {storeId}</div>
    </div>
  );
}
