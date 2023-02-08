import TelegramBot from "node-telegram-bot-api";
import { Configuration, OpenAIApi } from "openai";
import invariant from "tiny-invariant";
import { config } from "dotenv";
import { isDataView } from "util/types";
config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const token = process.env.TELEGRAM_BOT_TOKEN;
invariant(token, "TELEGRAM_BOT_TOKEN is not defined");
const openai = new OpenAIApi(configuration);

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg: any) => {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: msg.text,
    temperature: 0.8,
    max_tokens: 2000,
  });

  console.log(completion.data.choices)
  const basePromptOutput = completion.data.choices.pop();

  if(!basePromptOutput) {
    bot.sendMessage(msg.chat.id, "I don't know what to say")
  }

    bot.sendMessage(msg.chat.id, basePromptOutput?.text || "");
});

