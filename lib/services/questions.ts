import { questionsAgent } from "../mastra/agents/questions-agent";

const QUESTIONS_TIMEOUT_MS = 60000; // 60 seconds (longer since it may route to other agents)

async function answerQuestionInternal(telegramId: number, question: string): Promise<string> {
  console.log("🤖 Starting Mastra questions agent...");

  const response = await questionsAgent.generate(
    `User telegram_id: ${telegramId}\n\nQuestion: ${question}`,
    {
      maxSteps: 15, // Higher since it may delegate to other agents
    }
  );

  return response.text || "Unable to answer your question at this time.";
}

export async function answerQuestion(telegramId: number, question: string): Promise<string> {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("Question answering timed out")), QUESTIONS_TIMEOUT_MS);
  });

  const answerPromise = answerQuestionInternal(telegramId, question);

  return Promise.race([answerPromise, timeoutPromise]);
}
