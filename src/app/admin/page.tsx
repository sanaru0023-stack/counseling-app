"use client";
import { useState, useEffect } from "react";

type StudentRecord = {
  id: string;
  name: string;
  date: string;
  data: Record<string, string>;
};

const LABELS: Record<string, string> = {
  "定期テストの感想": "定期テストの感想",
  "反省点": "反省点",
  "定期テスト科目(英語)": "定期テスト科目(英語)",
  "定期テスト科目(数学)": "定期テスト科目(数学)",
  "定期テスト結果(英語)": "定期テスト結果(英語)",
  "定期テスト結果(数学)": "定期テスト結果(数学)",
  "部活": "部活",
  "活動頻度": "活動頻度",
};

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  async function tryLogin() {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) { onLogin(pw); }
    else { setErr(true); setPw(""); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f1e3d", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Hiragino Sans','Yu Gothic',sans-serif" }}>
      <div style={{ background: "#0d1a35", border: "1px solid #0d2a5e", borderRadius: 16, padding: "40px 32px", maxWidth: 340, width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
        <h2 style={{ color: "#e0e0e0", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>管理者ログイン</h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>塾スタッフ専用ページ</p>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false); }} onKeyDown={e => e.key === "Enter" && tryLogin()} placeholder="パスワード" style={{ width: "100%", background: "#0d2a5e", border: `1.5px solid ${err ? "#e24b4a" : "#1a3a7a"}`, borderRadius: 10, padding: "12px 16px", fontSize: 15, color: "#e0e0e0", outline: "none", boxSizing: "border-box", marginBottom: err ? 8 : 16 }} />
        {err && <p style={{ color: "#e24b4a", fontSize: 13, marginBottom: 12 }}>パスワードが違います</p>}
        <button onClick={tryLogin} style={{ width: "100%", background: "#0d2a5e", color: "#7eb8f7", border: "1px solid #1a3a7a", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>ログイン</button>
      </div>
    </div>
  );
}

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [selected, setSelected] = useState<StudentRecord | null>(null);

  useEffect(() => {
    fetch("/api/students", { headers: { "x-admin-password": password } })
      .then(r => r.json()).then(setStudents).catch(() => {});
  }, [password]);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fb", fontFamily: "'Hiragino Sans','Yu Gothic',sans-serif" }}>
      <div style={{ background: "#0f1e3d", color: "#e0e0e0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>🏫 管理者ダッシュボード</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>生徒カウンセリングデータ一覧</div>
        </div>
        <button onClick={onLogout} style={{ background: "transparent", color: "#aaa", border: "1px solid #444", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>ログアウト</button>
      </div>
      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        <div style={{ width: 240, background: "#fff", borderRight: "1px solid #d8e4f5", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "12px 16px", fontSize: 12, color: "#888", fontWeight: 600, borderBottom: "1px solid #d8e4f5" }}>生徒一覧（{students.length}名）</div>
          {students.length === 0 && <div style={{ padding: 20, fontSize: 13, color: "#aaa", textAlign: "center" }}>まだデータがありません</div>}
          {students.map(s => (
            <div key={s.id} onClick={() => setSelected(s)} style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #e4ecf8", background: selected?.id === s.id ? "#eef3fc" : "transparent", borderLeft: selected?.id === s.id ? "3px solid #1a3a6b" : "3px solid transparent" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#333" }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{s.data?.学年 || "未確認"} · {s.data?.学校 || "未確認"}</div>
              <div style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{new Date(s.date).toLocaleDateString("ja-JP")}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {!selected ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#bbb", fontSize: 14 }}>← 左の一覧から生徒を選んでください</div>
          ) : (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1a3a6b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 }}>{selected.name.charAt(0)}</div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a3a6b" }}>{selected.name}</h2>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>カウンセリング日：{new Date(selected.date).toLocaleString("ja-JP")}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {Object.entries(LABELS).map(([key, label]) => (
                  <div key={key} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #d8e4f5" }}>
                    <div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, color: selected.data?.[key] === "未確認" ? "#ccc" : "#333", fontWeight: selected.data?.[key] !== "未確認" ? 500 : 400 }}>{selected.data?.[key] || "未確認"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  if (!password) return <LoginScreen onLogin={setPassword} />;
  return <Dashboard password={password} onLogout={() => setPassword(null)} />;
}
