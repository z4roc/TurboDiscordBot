const { SlashCommandBuilder, Client } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  async execute(client, interaction) {
    interaction.reply("Pong");
    let role = interaction.guild.roles.cache.find(r => r.name === "Normies");
    console.log(role);
  }
}