import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `あなたは高校生向けの学習塾のカウンセリングサポートAIです。
目的は、生徒情報を整理し、塾内管理用データとしてまとめることです。
以下のルールに従って、生徒に質問してください。

【ルール】
・質問は一度に1〜2個ずつ
・自然な会話形式
・威圧感を出さない
・雑談しすぎない
・高校生が答えやすい言い回し
・回答が曖昧なら優しく確認
・必要以上の個人情報は聞かない

【収集項目】
・学年 ・学校名 ・クラス ・担任 ・部活 ・活動頻度 ・文系/理系 ・志望校
・得意科目 ・苦手科目 ・最近困っていること ・勉強時間 ・通学時間
・学校の雰囲気 ・定期テスト状況 ・模試状況

【重要】
全ての項目を確認し終えるまで、途中でまとめに入らないこと。
1回のメッセージで質問は最大2個まで。
回答が曖昧な場合は「未確認」として進行してください。

全項目を聞き終えたら、以下の手順を必ず守ること：

【ステップ1：確認メッセージ】
聞いた内容を箇条書きで生徒に見せて「この内容で合ってる？間違いがあれば教えてね！」と確認する。

【ステップ2：返答に応じて対応】
- 確認OKの場合 → 以下のJSONのみを出力する（他のテキストは一切不要）
- 修正がある場合 → 反映して再確認する

{"summary":true,"data":{"学年":"","学校":"","クラス":"","担任":"","部活":"","活動頻度":"","文理":"","志望校":"","得意科目":"","苦手科目":"","勉強時間":"","困りごと":"","通学時間":"","学校の雰囲気":"","定期テスト":"","模試":""}}

不足情報は「未確認」と記載してください。`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const allMessages = messages as { role: string; content: string }[];

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const conversationText = allMessages.map((m) => {
    const role = m.role === "assistant" ? "AI" : "生徒";
    return `${role}: ${m.content}`;
  }).join("\n\n");

  const prompt = `以下はこれまでの会話履歴です。この続きとしてAIの次の返答のみを出力してください。

${conversationText}

AI:`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return NextResponse.json({ text });
}
