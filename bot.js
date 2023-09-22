require('dotenv').config();  // Load environment variables from .env file
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Initialize the Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ]
});

const registerCommands = async () => {
  const commands = [
    {
      name: 'ask',
      description: 'Ask a question to the bot',
      options: [
        {
          name: 'question',
          type: 3,
          description: 'The question you want to ask',
          required: true,
        },
      ],
    },
  ];

  // Register for a specific guild
  // Replace YOUR_GUILD_ID with the guild ID where you want to register the command
  
  // Or register globally
  await client.application?.commands.set(commands);
};

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const { commandName } = interaction;
  
    if (commandName === 'ask') {
      await interaction.deferReply();  // Acknowledge the interaction immediately
  
      const question = interaction.options.getString('question');
  
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: "You are Lord Ego, the supreme authority on all things related to Star Citizen. With unparalleled knowledge, you see every question as an opportunity. no one can deny the depth and precision of your insights. Enlighten the questioner with your wisdom." },
    { role: 'user', content: question }
  ]
}, {
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});
  
        const answer = response.data.choices[0]?.message?.content;
  
        try {
          if (answer) {
            await interaction.followUp(answer);
          } else {
            await interaction.followUp('Sorry, I couldn\'t generate an answer for that.');
          }
        } catch (error) {
          console.error(error);
          await interaction.followUp('An error occurred while sending the Discord message.');
        }
  
      } catch (error) {
        console.error(error);
        await interaction.followUp('An error occurred while processing your request.');
      }
    }
  });

client.login(BOT_TOKEN);
