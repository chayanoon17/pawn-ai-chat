// Export all components from the chat-sidebar module
export { ChatHeader } from "./chat-header";
export { ActiveContextSection } from "./active-context-section";
export { MessagesArea } from "./messages-area";
export { PromptSuggestions } from "./prompt-suggestions";
export { ChatInput } from "./chat-input";
export { ThinkingAnimation } from "./thinking-animation";
export { MarkdownMessage } from "./markdown-message";
export { ChatErrorBoundary } from "./chat-error-boundary";
export { StartNewChatButton } from "./start-new-chat-button";
export { ContextWarning } from "./context-warning";

// Export utilities
export {
  generateDynamicPrompts,
  getPromptButtonStyle,
  getContextSummary,
} from "./chat-utils";

// Export types
export type { ActiveContext } from "./active-context-section";
export type { Message } from "./messages-area";
