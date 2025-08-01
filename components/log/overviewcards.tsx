"use client";
import React from "react";

interface OverviewItem {
  label: string;
  value: number;
}

export const OverviewCards = ({ items }: { items: OverviewItem[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    {items.map((o) => (
      <div key={o.label} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">{o.label}</div>
        <div className="mt-2 text-3xl font-bold">
          {o.value.toLocaleString()}
        </div>
      </div>
    ))}
  </div>
);
