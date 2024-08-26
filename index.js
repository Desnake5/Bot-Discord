require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const userinfo = require("./components/userinfo")
const avatar = require("./components/avatar")
const banner = require("./components/banner")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Trigger when the bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Respond to "i" to get the avatar or "b" to get the banner
client.on('messageCreate', async message => {
    // Check if the message starts with "i" or "b" or "bo"
    if (message.content.toLowerCase().startsWith('i') || message.content.toLowerCase().startsWith('b') ||  message.content.toLowerCase().startsWith('bo')) {
        // Determine if we are fetching avatar or banner
        let type = "banner";
        switch (message.content.toLowerCase()) { // b i bo
            case "i":
                type = "avatar"
                break;
            case "bo":
                type = "info"
                break;
        }


        // Get the first mentioned user, or the message author if no one is mentioned
        let user = message.mentions.users.first() || message.author;

        // Handle banner request
        if (type === 'banner') {
            await banner(user,client,message);
        } else if(type === 'avatar') {
          await avatar(user,message)
        }else{
            await userinfo(message);
        }
    }
});

// Log in to Discord with your bot token from the .env file
client.login(process.env.TOKEN);
