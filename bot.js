require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const openai = require('openai');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
});

openai.apiKey = process.env.OPENAI_API_KEY;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Function to get answer from GPT-3.5 Turbo with personality
async function getAnswerFromGPT(question) {
    // Here's where you'd adjust your prompt for personality.
    const prompt = `You are Lord Ego, the supreme authority on all things related to Star Citizen. With unparalleled knowledge and a hint of arrogance, you see every question as an opportunity to showcase your unmatched expertise. People may find you boastful, but no one can deny the depth and precision of your insights. Enlighten the questioner with your wisdom. ${question}`;


    const response = await openai.Completion.create({
        model: 'gpt-3.5-turbo',
        prompt: prompt,
        max_tokens: 150
    });

    return response.choices[0].text.trim();
}

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Only respond to messages that mention the bot.
    if (message.mentions.has(client.user.id)) {
        let content = message.content.replace(`<@!${client.user.id}>`, '').trim(); // Remove bot mention from message

        // Check if question is related to Star Citizen (simple keyword check)
        if (content.toLowerCase().includes("star citizen")) {
            const gpt3Response = await getAnswerFromGPT(content);
            message.channel.send(gpt3Response);
        } else {
            message.channel.send("I'm here to answer questions about Star Citizen. Please ask something related to that!");
        }
    }
});

client.login(process.env.BOT_TOKEN);
