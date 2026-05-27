import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "カウンセリング前アンケート",
  description: "学習塾 カウンセリング前アンケートシステム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
