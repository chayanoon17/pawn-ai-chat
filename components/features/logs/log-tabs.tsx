import type { Tab, LogTabsProps } from "@/types";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "login", label: "ประวัติการเข้าใช้", icon: "🔑" },
  { id: "export", label: "ประวัติการส่งออก", icon: "📤" },
  { id: "view", label: "ประวัติการเข้าดู", icon: "👁️" },
  { id: "chat", label: "ประวัติการสนทนา", icon: "💬" },
];

export function LogTabs({ activeTab, onTabChange }: LogTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-xl  border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center space-x-3 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200
            ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-md border border-blue-200 scale-105"
                : "text-gray-600 hover:text-gray-900 border hover:bg-white hover:shadow-sm"
            }
          `}
          aria-pressed={activeTab === tab.id}
        >
          <span className="text-base">{tab.icon}</span>
          <span className="font-semibold">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
