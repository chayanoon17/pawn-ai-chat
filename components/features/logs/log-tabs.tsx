import { Tab } from "./types";

interface LogTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "login", label: "ประวัติการเข้าใช้", icon: "🔑" },
  { id: "export", label: "ประวัติการส่งออก", icon: "📤" },
  { id: "view", label: "ประวัติการเข้าดู", icon: "👁️" },
  { id: "chat", label: "ประวัติการสนทนา", icon: "💬" },
];

export function LogTabs({ activeTab, onTabChange }: LogTabsProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors
            ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }
          `}
          aria-pressed={activeTab === tab.id}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
