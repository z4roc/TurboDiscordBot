import dotenv from 'dotenv';
dotenv.config();

import { ActivityType, Client, GatewayIntentBits } from 'discord.js';

const client = new Client( 
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.GuildPresences
        ]
    });

client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
    console.log(`${client.user.tag} is now online!`);
    client.user.setActivity({
        name: "Morbius",
        type: ActivityType.Watching
    });
});

client.on("messageCreate", async (message) => {
    if(!message?.author.bot) {
        message.channel.send(`ECHO ${message.content}`)
    }
});



