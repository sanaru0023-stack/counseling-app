"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const FIRST_MESSAGE = "こんにちは！今日はカウンセリングに来てくれてありがとう😊\n\nまず、**今何年生か**と、**通っている学校名**を教えてもらえる？";

function renderContent(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return <span key={i}>{part}</span>;
  });
}

function CounselingChat() {
  const searchParams = useSearchParams();
  const studentName = searchParams.get("name") || "生徒";
  const router = useRouter();

  const [messages, setMessages] = useState([{ role: "assistant", content: FIRST_MESSAGE }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const text: string = data.text || "";
      try {
        const parsed = JSON.parse(text);
        if (parsed.summary) {
          await fetch("/api/students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: studentName, data: parsed.data }),
          });
          setDone(true);
          setLoading(false);
          return;
        }
      } catch (_) {}
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "エラーが発生しました。もう一度試してね。" }]);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Hiragino Sans','Yu Gothic',sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "48px 36px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#ddeaf9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a3a6b", margin: "0 0 12px" }}>カウンセリングが完了しました！</h2>
          <p style={{ fontSize: 14, color: "#888", lineHeight: 1.8, margin: "0 0 32px" }}>
            {studentName} さん、ご協力ありがとうございました。<br />記録が完了しました。
          </p>
          <button onClick={() => router.push("/")} style={{ width: "100%", background: "#1a3a6b", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>ログアウト</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f0f4fb", fontFamily: "'Hiragino Sans','Yu Gothic',sans-serif" }}>
      <div style={{ background: "#1a3a6b", color: "#fff", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a5aa8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📚</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>カウンセリング前アンケート</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{studentName} さん</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a3a6b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>AI</div>
            )}
            <div style={{ maxWidth: "72%", background: m.role === "user" ? "#1a3a6b" : "#fff", color: m.role === "user" ? "#fff" : "#333", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              {renderContent(m.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a3a6b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>AI</div>
            <div style={{ background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <span style={{ display: "inline-flex", gap: 4 }}>
                {[0,1,2].map(j => <span key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a3a6b", opacity: 0.5, display: "inline-block", animation: `bounce 1s ${j*0.2}s infinite` }} />)}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #d8e4f5", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()} placeholder="メッセージを入力..." disabled={loading} style={{ flex: 1, border: "1.5px solid #b8d0f0", borderRadius: 24, padding: "10px 16px", fontSize: 14, outline: "none", background: "#f8faff" }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: "#1a3a6b", color: "#fff", border: "none", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", opacity: (loading || !input.trim()) ? 0.5 : 1 }}>↑</button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

export default function CounselingPage() {
  return <Suspense><CounselingChat /></Suspense>;
}
