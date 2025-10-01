// backend/agent/Agent.js
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import ChatMessage  from "../models/ChatMessage.js";

const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🛠️ Membuat agent baru dengan memory berdasarkan pesan lama
 */
function createAgent(pastMessages) {
  const memory = new BufferMemory({
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
    chatHistory: pastMessages || [],
  });

  return new ConversationChain({
    llm,
    memory,
  });
}

/**
 * 💬 Fungsi untuk tanya ke agent
 */
export async function askAgent(sessionId, userMessage) {
  // 1. Ambil riwayat chat dari DB
  const history = await ChatMessage.findAll({
    where: { sessionId },
    order: [["createdAt", "ASC"]],
  });

  // 2. Ubah riwayat jadi format LangChain
  const pastMessages = history.map(m =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
  );

  // 3. Buat agent baru
  const agent = createAgent(pastMessages);

  // 4. Invoke model
  const res = await agent.invoke({ input: userMessage });

  // 5. Simpan pesan baru ke DB
  await ChatMessage.create({ sessionId, role: "user", content: userMessage });
  await ChatMessage.create({ sessionId, role: "assistant", content: res.output });

  return res.output;
}
