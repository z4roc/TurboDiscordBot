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
  data: new SlashCommandBuilder().setName("purge").setDescription("Begone messages!"),
  async execute(client, interaction) {
    
    //const msgCount = await GetMessageCount(client, interaction.channelId);
    //console.log(msgCount);
    //interaction.reply(`$This channel contains ${msgCount} messages`);
    await interaction.channel.bulkDelete(20);
    interaction.reply(`I deleted Messages!`);
    //interaction.channel.send(`Deleted ${msgcount} messages`);
  }
};