import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";
import { AddContextButton } from "@/components/ui/add-context-button";
import { WidgetData } from "@/context/widget-context";

interface ChatHeaderProps {
  onClose: () => void;
  onContextAdded: (widget: WidgetData) => void;
  activeContexts: { widget: { id: string; name: string } }[]; // Added to track active contexts
}

export const ChatHeader = ({
  onClose,
  onContextAdded,
  activeContexts,
}: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-[#308AC7] text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Pawn AI</h3>
            <p className="text-xs text-blue-100">ผู้ช่วยอัจฉริยะ</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <AddContextButton
            onContextAdded={onContextAdded}
            activeContexts={activeContexts}
            className="text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
