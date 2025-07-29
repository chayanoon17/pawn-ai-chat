import { Button } from "@/components/ui/button";
import { Bot, ChevronUp, ChevronDown } from "lucide-react";

interface PromptSuggestionsProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  prompts: string[];
  onPromptClick: (prompt: string) => void;
  isLoading?: boolean;
  getPromptButtonStyle?: (prompt: string) => string;
  title: string;
  subtitle?: string;
  variant?: "general" | "context";
}

export const PromptSuggestions = ({
  isExpanded,
  onToggleExpanded,
  prompts,
  onPromptClick,
  isLoading = false,
  getPromptButtonStyle,
  title,
  subtitle,
  variant = "general",
}: PromptSuggestionsProps) => {
  const isGeneral = variant === "general";
  const bgColor = isGeneral
    ? "bg-gradient-to-r from-gray-50 to-white"
    : "bg-gradient-to-r from-blue-50/50 to-indigo-50/50";
  const hoverBg = isGeneral
    ? "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50"
    : "hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-indigo-100/50";
  const iconBg = isGeneral ? "bg-gray-100" : "bg-blue-100";
  const iconHoverBg = isGeneral ? "hover:bg-gray-200" : "hover:bg-blue-200";
  const iconColor = isGeneral ? "text-gray-600" : "text-blue-600";
  const titleColor = isGeneral ? "text-gray-700" : "text-blue-800";
  const subtitleColor = isGeneral ? "text-gray-600" : "text-indigo-600";

  return (
    <div className={`border-t border-gray-200 ${bgColor}`}>
      {/* Header with toggle button */}
      <div
        className={`px-4 pt-3 pb-2 cursor-pointer ${hoverBg} transition-all duration-300`}
        onClick={onToggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1 ${iconBg} rounded-lg`}>
              <Bot className={`w-4 h-4 ${iconColor}`} />
            </div>
            {subtitle ? (
              <div>
                <span className={`text-sm font-semibold ${titleColor}`}>
                  {title}
                </span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span
                    className={`text-xs ${
                      isGeneral
                        ? "bg-gray-100 text-gray-600"
                        : "text-blue-600 bg-blue-100"
                    } px-2 py-0.5 rounded-full font-medium`}
                  >
                    {prompts.length} คำถาม
                  </span>
                  <span className={`text-xs ${subtitleColor}`}>{subtitle}</span>
                </div>
              </div>
            ) : (
              <>
                <span className={`text-sm font-semibold ${titleColor}`}>
                  {title}
                </span>
                <span
                  className={`text-xs ${
                    isGeneral
                      ? "bg-gray-100 text-gray-600"
                      : "bg-gray-100 text-gray-600"
                  } px-2 py-1 rounded-full`}
                >
                  {prompts.length} คำถาม
                </span>
              </>
            )}
          </div>
          <div
            className={`p-1 ${iconBg} ${iconHoverBg} rounded-lg transition-colors duration-200`}
          >
            {isExpanded ? (
              <ChevronUp className={`w-4 h-4 ${iconColor}`} />
            ) : (
              <ChevronDown className={`w-4 h-4 ${iconColor}`} />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div
            className={`${isGeneral ? "max-h-40" : "max-h-48"} overflow-y-auto`}
          >
            <div className="grid grid-cols-1 gap-2">
              {prompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className={
                    getPromptButtonStyle
                      ? `text-left justify-start h-auto py-3 transition-all duration-200 shadow-sm hover:shadow-md ${getPromptButtonStyle(
                          prompt
                        )} ${!isGeneral ? "hover:scale-[1.02]" : ""}`
                      : "text-sm text-left justify-start h-auto py-3 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  }
                  disabled={isLoading}
                  onClick={() => onPromptClick(prompt)}
                >
                  <span
                    className={`truncate ${
                      !isGeneral ? "text-xs font-medium" : ""
                    }`}
                  >
                    {prompt}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
