import React, { useState, useRef, useEffect } from "react";
import { useRAGAsk, useRAGHistory, useClearRAGHistory } from "@/hooks/useRAG";
import type { RAGConversation } from "@/hooks/useRAG";
import {
  Brain,
  Send,
  Trash2,
  Sparkles,
  Database,
  Loader2,
  MessageSquare,
  Users,
  Dumbbell,
  ClipboardList,
  Apple,
  TrendingUp,
  Megaphone,
  AlertCircle,
} from "lucide-react";

// ─── Collection Icon Map ─────────────────────────────────────────────────────
const COLLECTION_ICONS: Record<string, React.ReactNode> = {
  users: <Users className="w-3 h-3" />,
  workouts: <Dumbbell className="w-3 h-3" />,
  attendances: <ClipboardList className="w-3 h-3" />,
  metrics: <TrendingUp className="w-3 h-3" />,
  diets: <Apple className="w-3 h-3" />,
  announcements: <Megaphone className="w-3 h-3" />,
};

const COLLECTION_COLORS: Record<string, string> = {
  users: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  workouts: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  attendances: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  metrics: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  diets: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  announcements: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

// ─── Suggested Questions ─────────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  { label: "Students per batch", question: "How many students are in each batch?" },
  { label: "Inactive students", question: "Which students haven't attended in the last 7 days?" },
  { label: "Top attendees", question: "Who are the top 5 most consistent students this month?" },
  { label: "Workout completion", question: "What is the average workout completion rate?" },
  { label: "BMI trends", question: "Show students whose BMI has changed in the last month" },
  { label: "Recent enrollments", question: "Who are the newest students that joined this month?" },
];

/*
// ─── Query Details Component ─────────────────────────────────────────────────
const QueryDetails = ({ conversation }: { conversation: RAGConversation }) => {
  const [expanded, setExpanded] = useState(false);

  if (!conversation.generatedQuery?.collection) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider hover:text-gray-400 transition-colors"
      >
        <Database className="w-3 h-3" />
        Query Details
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="mt-2 p-3 bg-gray-950/60 rounded-lg border border-gray-800/50 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div>
            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Collection</span>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{conversation.generatedQuery.collection}</p>
          </div>
          {conversation.generatedQuery.pipeline && (
            <div>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Pipeline</span>
              <pre className="text-[10px] text-gray-500 font-mono mt-0.5 overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(conversation.generatedQuery.pipeline, null, 2)}
              </pre>
            </div>
          )}
          {conversation.queryResults && conversation.queryResults.length > 0 && (
            <div>
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                Raw Data ({conversation.queryResults.length} results)
              </span>
              <pre className="text-[10px] text-gray-500 font-mono mt-0.5 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(conversation.queryResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
*/

// ─── Message Bubble Component ────────────────────────────────────────────────
const MessageBubble = ({
  conversation,
  isLatest,
}: {
  conversation: RAGConversation;
  isLatest: boolean;
}) => {
  return (
    <div className={`space-y-4 ${isLatest ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}`}>
      {/* User Question */}
      <div className="flex justify-end">
        <div className="max-w-[80%] lg:max-w-[65%]">
          <div className="bg-primary/15 border border-primary/20 rounded-2xl rounded-br-md px-4 py-3">
            <p className="text-sm text-gray-200 leading-relaxed">{conversation.question}</p>
          </div>
          <p className="text-[10px] text-gray-700 mt-1 text-right">
            {new Date(conversation.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* AI Answer */}
      <div className="flex justify-start">
        <div className="max-w-[85%] lg:max-w-[75%]">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Brain className="w-4 h-4 text-violet-400" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Answer bubble */}
              <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl rounded-tl-md px-4 py-3">
                {conversation.error ? (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400 leading-relaxed">{conversation.answer}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {conversation.answer}
                  </p>
                )}
              </div>

              {/* Source badges */}
              {conversation.sources && conversation.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {conversation.sources.map((source, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        COLLECTION_COLORS[source.collection] || "bg-gray-700/30 text-gray-400 border-gray-700/50"
                      }`}
                    >
                      {COLLECTION_ICONS[source.collection] || <Database className="w-3 h-3" />}
                      {source.collection}
                      {source.count > 0 && (
                        <span className="opacity-60">· {source.count}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Query details (expandable) - Disabled per user request */}
              {/* <QueryDetails conversation={conversation} /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminRAGChat = () => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: history, isLoading: historyLoading } = useRAGHistory();
  const askMutation = useRAGAsk();
  const clearMutation = useClearRAGHistory();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, askMutation.isPending]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || askMutation.isPending) return;
    setInput("");
    askMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedClick = (question: string) => {
    if (askMutation.isPending) return;
    setInput("");
    askMutation.mutate(question);
  };

  const handleClear = () => {
    if (clearMutation.isPending) return;
    clearMutation.mutate();
  };

  const conversations = history || [];
  const isEmpty = conversations.length === 0 && !askMutation.isPending;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-5rem)]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              AI Assistant
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-xs text-gray-500">
              Ask anything about your gym data — powered by RAG
            </p>
          </div>
        </div>

        {conversations.length > 0 && (
          <button
            onClick={handleClear}
            disabled={clearMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 overflow-y-auto min-h-0 rounded-2xl bg-gray-900/50 border border-gray-800/50 p-4 lg:p-6 space-y-6">
        {historyLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
          </div>
        ) : isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/15 flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-violet-400/60" />
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-1">
              Ask me anything about your gym
            </h3>
            <p className="text-xs text-gray-600 max-w-md mb-8">
              I can query your students, workouts, attendance, metrics, diets, and more.
              Try one of the suggestions below to get started.
            </p>

            {/* Suggested questions grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full max-w-2xl">
              {SUGGESTED_QUESTIONS.map((sq) => (
                <button
                  key={sq.label}
                  onClick={() => handleSuggestedClick(sq.question)}
                  className="group p-3 bg-gray-800/40 border border-gray-800 rounded-xl hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-left"
                >
                  <p className="text-xs font-semibold text-gray-400 group-hover:text-violet-400 transition-colors">
                    {sq.label}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">{sq.question}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conversation messages */
          <>
            {conversations.map((conv, i) => (
              <MessageBubble
                key={conv._id}
                conversation={conv}
                isLatest={i === conversations.length - 1}
              />
            ))}

            {/* Loading state for pending question */}
            {askMutation.isPending && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Show the question being asked */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] lg:max-w-[65%]">
                    <div className="bg-primary/15 border border-primary/20 rounded-2xl rounded-br-md px-4 py-3">
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {(askMutation.variables as string) || "..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-violet-400 animate-pulse" />
                    </div>
                    <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                        <span className="text-xs text-gray-500">
                          Analyzing your data...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ── Suggested Chips (when conversation exists) ── */}
      {!isEmpty && !askMutation.isPending && (
        <div className="flex gap-2 overflow-x-auto py-2 shrink-0 scrollbar-hide">
          {SUGGESTED_QUESTIONS.slice(0, 4).map((sq) => (
            <button
              key={sq.label}
              onClick={() => handleSuggestedClick(sq.question)}
              className="shrink-0 px-3 py-1.5 text-[10px] font-semibold text-gray-500 bg-gray-800/50 border border-gray-800 rounded-full hover:border-violet-500/30 hover:text-violet-400 transition-all whitespace-nowrap"
            >
              {sq.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className="shrink-0 mt-2">
        <div className="flex items-center gap-2 bg-gray-900/80 border border-gray-800 rounded-xl p-2 focus-within:border-violet-500/40 transition-colors">
          <MessageSquare className="w-4 h-4 text-gray-600 ml-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about students, workouts, attendance..."
            disabled={askMutation.isPending}
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || askMutation.isPending}
            className="w-9 h-9 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-700 text-white flex items-center justify-center transition-all duration-200 shrink-0"
          >
            {askMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[9px] text-gray-700 text-center mt-1.5">
          AI answers are grounded in your live gym data. Always verify critical information.
        </p>
      </div>
    </div>
  );
};

export default AdminRAGChat;
