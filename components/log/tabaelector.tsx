"use client";
import React from "react";

type Tab = "login" | "export" | "view" | "chat";

interface TabItem {
  key: Tab;
  label: string;
  count: number;
}

export const TabSelector = ({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: TabItem[];
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) => (
  <div className="flex border-b mb-4">
    {tabs.map((t) => (
      <button
        key={t.key}
        onClick={() => setActiveTab(t.key)}
        className={`px-4 py-2 -mb-px font-medium ${
          activeTab === t.key
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);
