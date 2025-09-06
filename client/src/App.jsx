import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = inputValue;
    setInputValue("");
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/api/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: currentInput }),
    });
    const data = await res.json();
    const ans = data.answer;

    const botMessage = {
      id: Date.now() + 1,
      text: ans,
      sender: "bot",
    };
    setLoading(false);

    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="flex flex-col h-screen items-center bg-slate-100">
      {/* Sticky Header */}
      <div className="sticky w-full bg-slate-600 text-white p-3 sm:p-4 shadow-md text-center rounded-b-lg">
        <h1 className="text-lg sm:text-xl font-bold">ChatBot Assistant</h1>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 w-full max-w-2xl p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-8 px-4">
            <p className="text-sm sm:text-base">
              <span className="font-bold">TechCorp Assistant</span> – Your
              Company Information Hub <br className="hidden sm:block" /> Instant
              answers to company policies, benefits, and guidelines – all from
              TechCorp's documentation.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-slate-500 text-white"
                    : "bg-white text-slate-800 shadow-md"
                }`}
              >
                <p className="text-sm break-words">{message.text}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg bg-white text-slate-800 shadow-md">
              <p className="text-sm animate-bounce">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Footer with Input */}
      <div className="w-full max-w-2xl sticky bottom-0 bg-white border-t border-slate-200 p-3 sm:p-4 rounded-lg safe-area-padding-bottom">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
          <button
            onClick={handleSubmit}
            className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-slate-500 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors whitespace-nowrap"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
