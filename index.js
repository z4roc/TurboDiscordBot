require("dotenv").config();

const { ActivityType, Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');

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

client.commands = new Collection()

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

commandFiles.forEach( commandFile => {
  const command = require(`./commands/${commandFile}`);
  client.commands.set(command.data.name, command);
});

client.login(process.env.DISCORD_TOKEN);

client.once("ready", () => {
    console.log(`${client.user.tag} is now online!`);
    client.user.setActivity({
        name: "Cyberpunk 2077",
        type: ActivityType.Playing
    });
  
});

/*client.on("messageCreate", async (message) => {
    if(!message?.author.bot) {
        message.channel.send(`ECHO ${message.content}`)
    }
});*/

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName); 
    if(command) {
        try {
            await command.execute(client, interaction);
        }
        catch(error) {
            if(interaction.deferred || interaction.replied) {
                interaction.editReply("An error has occured" + error);
            } else {
                interaction.reply("An error has occured" + error);
            }
        }
    }
});



