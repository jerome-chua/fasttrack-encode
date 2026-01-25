import { InMemoryRunner } from "@google/adk";
import { QUESTIONS_AGENT_NAME, questionsAgent } from "../agents/questions-agent";

const QUESTIONS_TIMEOUT_MS = 60000; // 60 seconds (longer since it may route to other agents)

async function answerQuestionInternal(telegramId: number, question: string): Promise<string> {
  const APP_NAME = "questionsAgent";
  const runner = new InMemoryRunner({
    agent: questionsAgent,
    appName: APP_NAME,
  });

  const userId = telegramId.toString();
  const session = await runner.sessionService.createSession({
    appName: APP_NAME,
    userId,
  });

  const newMessage = {
    role: "user" as const,
    parts: [
      {
        text: `User telegram_id: ${telegramId}\n\nQuestion: ${question}`,
      },
    ],
  };

  let agentResponse = "";
  for await (const event of runner.runAsync({
    userId,
    sessionId: session.id,
    newMessage,
  })) {
    const isAgentResponse = event.author === QUESTIONS_AGENT_NAME;
    const contentParts = event.content?.parts;

    if (isAgentResponse && contentParts) {
      agentResponse = "";
      for (const part of contentParts) {
        if ("text" in part && part.text) {
          agentResponse += part.text;
        }
      }
    }
  }

  return agentResponse;
}

export async function answerQuestion(telegramId: number, question: string): Promise<string> {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("Question answering timed out")), QUESTIONS_TIMEOUT_MS);
  });

  const answerPromise = answerQuestionInternal(telegramId, question);

  return Promise.race([answerPromise, timeoutPromise]);
}
