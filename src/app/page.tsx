"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  function start() {
    if (!name.trim()) return;
    router.push(`/counseling?name=${encodeURIComponent(name.trim())}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Hiragino Sans','Yu Gothic',sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "40px 32px", maxWidth: 400, width: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>📚</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a3a6b", marginBottom: 8 }}>カウンセリング前アンケート</h1>
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 28 }}>
          AIがやさしくヒアリングします。<br />まずお名前を入力してください。
        </p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && start()}
          placeholder="例：山田 太郎"
          style={{ width: "100%", border: "1.5px solid #b8d0f0", borderRadius: 10, padding: "12px 16px", fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 16 }}
        />
        <button
          onClick={start}
          disabled={!name.trim()}
          style={{ width: "100%", background: "#1a3a6b", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: name.trim() ? 1 : 0.5 }}
        >
          カウンセリングをはじめる
        </button>
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #e4ecf8" }}>
          <a href="/admin" style={{ color: "#999", fontSize: 13, textDecoration: "underline" }}>管理者ページへ</a>
        </div>
      </div>
    </div>
  );
}
