export const chatWithGemini = async (message: string, history: { role: "user" | "model", parts: string[] }[] = []) => {
  try {
    let formattedHistory = history
      .filter(h => h.parts && h.parts.length > 0 && h.parts[0])
      .map(h => ({
        role: h.role,
        text: h.parts[0]
      }));

    const firstUserIndex = formattedHistory.findIndex(h => h.role === "user");
    if (firstUserIndex !== -1) {
      formattedHistory = formattedHistory.slice(firstUserIndex);
    } else {
      formattedHistory = [];
    }

    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: message,
        history: formattedHistory,
        mode: "chat"
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Xin lỗi, không có phản hồi từ hệ thống.";
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    return "Xin lỗi, tôi đang gặp trục trặc kỹ thuật khi kết nối với AI. Vui lòng thử lại sau!";
  }
};
