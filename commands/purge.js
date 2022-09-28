const { SlashCommandBuilder } = require("discord.js");

async function GetMessageCount(client, channelId) {
  const channel = client.channels.cache.get(channelId);
  let messages = [];

  let message = await channel.messages
    .fetch({limit: 1})
    .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
  
  while(message) {
    await channel.messages.fetch({limit: 100, before:message.id}).
      then( messagePage => {
        messagePage.forEach(message => messages.push(message));
        message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
      });
  }
  return messages.length;
}

module.exports = {
  data: new SlashCommandBuilder().setName("purge").setDescription("Begone messages!")
    .addIntegerOption(option => 
      option.setName("count")
      .setDescription("The number of Messages you want to delete")
      .setRequired(true)),
  async execute(client, interaction) {
      await interaction.channel.bulkDelete(interaction.options.getInteger("count"));
      interaction.reply(`I deleted ${interaction.options.getInteger("count")} Messages!`);
  }
};