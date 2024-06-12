"use client";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import React from "react";

export default function Orders() {
  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 h-screen overflow-auto">
        <TopBar />
        <div className="p-4">
          <p>Hello from Orders</p>
        </div>
      </div>
    </div>
  );
}
