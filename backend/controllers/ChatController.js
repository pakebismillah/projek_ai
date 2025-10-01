// backend/controllers/ChatController.js
import models from "../models/Models.js";
import { askAgent } from "../agent/agent.js";  
const { Chat, Session } = models;

// kirim pesan ke AI + simpan ke DB
export const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    // cek session valid milik user
    const session = await Session.findOne({ 
      where: { id: sessionId, userId: req.user.id } 
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    // panggil agent
    const aiReply = await askAgent(message, sessionId);

    // simpan pesan user
    await Chat.create({
      sessionId,
      sender: "user",
      message,
    });

    // simpan jawaban AI
    await Chat.create({
      sessionId,
      sender: "ai",
      message: aiReply,
    });

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ambil semua chat dari session tertentu
export const getChats = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ 
      where: { id: sessionId, userId: req.user.id } 
    });
    if (!session) return res.status(404).json({ message: "Session not found" });

    const chats = await Chat.findAll({
      where: { sessionId },
      order: [["createdAt", "ASC"]],
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
