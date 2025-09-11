import { Bot } from "lucide-react";
import { useState, useEffect } from "react";

// 🎯 Status messages that change during thinking process
const THINKING_STAGES = [
  { message: "กำลังวิเคราะห์คำถาม", duration: 3000 },
  { message: "กำลังรวบรวมข้อมูล", duration: 4000 },
  { message: "กำลังประมวลผลข้อมูล", duration: 4000 },
  { message: "กำลังคิดและวิเคราะห์", duration: 5000 },
  { message: "กำลังสรุปคำตอบ", duration: 4000 },
  { message: "กำลังตรวจสอบความถูกต้อง", duration: 3000 },
  { message: "เกือบเสร็จแล้ว", duration: 2000 },
];

// 🤖 AI Thinking Animation Component - Enhanced with Progressive Status
export const ThinkingAnimation = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateStage = () => {
      const elapsedTime = Date.now() - startTime;

      // Calculate cumulative duration to determine current stage
      let cumulativeDuration = 0;
      let nextStageIndex = 0;

      for (let i = 0; i < THINKING_STAGES.length; i++) {
        cumulativeDuration += THINKING_STAGES[i].duration;
        if (elapsedTime < cumulativeDuration) {
          nextStageIndex = i;
          break;
        }
        nextStageIndex = Math.min(i + 1, THINKING_STAGES.length - 1);
      }

      setCurrentStageIndex(nextStageIndex);

      // Set timeout for next stage if not at the last stage
      if (nextStageIndex < THINKING_STAGES.length - 1) {
        const timeToNextStage = cumulativeDuration - elapsedTime;
        timeoutId = setTimeout(updateStage, timeToNextStage);
      } else {
        // Stay at last stage, cycle between last few messages
        const finalStages = [
          "เกือบเสร็จแล้ว",
          "กำลังเตรียมคำตอบ",
          "อีกสักครู่",
        ];
        let finalIndex = 0;

        const cycleFinalMessages = () => {
          const customStage = {
            message: finalStages[finalIndex % finalStages.length],
            duration: 2000,
          };

          setCurrentStageIndex(THINKING_STAGES.length - 1);
          // Update the last stage message
          THINKING_STAGES[THINKING_STAGES.length - 1] = customStage;

          finalIndex++;
          timeoutId = setTimeout(cycleFinalMessages, 2000);
        };

        timeoutId = setTimeout(cycleFinalMessages, 2000);
      }
    };

    // Start the stage progression
    updateStage();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [startTime]);

  const currentStage = THINKING_STAGES[currentStageIndex] || THINKING_STAGES[0];

  return (
    <div className="flex items-center space-x-2">
      <div className="p-1 bg-blue-100 rounded-full">
        <Bot className="w-3 h-3 text-blue-600 animate-pulse" />
      </div>
      <span className="text-xs font-medium text-blue-600 transition-all duration-500 ease-in-out">
        {currentStage.message}
      </span>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
      {/* Progress indicator */}
      {/* <div className="ml-2 flex space-x-0.5">
        {THINKING_STAGES.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              index <= currentStageIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
};
