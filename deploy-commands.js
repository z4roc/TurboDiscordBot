require("dotenv").config();

const fs = require('fs');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const commands = [];

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

commandFiles.forEach( commandFile => {
  const command = require(`./commands/${commandFile}`);
  commands.push(command.data.toJSON());
});

const restClient = new REST({
  version: "10"
}).setToken(process.env.DISCORD_TOKEN);

restClient.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);


restClient.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);



restClient.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
{
  body: commands
}).then(() => {
  console.log(`Successfully registered ${commands.length} commands in the Guild`);
}).catch(console.error);

restClient.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands })
	.then(() => console.log('Successfully placed all commands globally'))
	.catch(console.error);


