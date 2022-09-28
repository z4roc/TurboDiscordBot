const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayer, joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder().setName("play").setDescription("Pong!"),
  async execute(client, interaction) {

    const member = interaction.guild.members.cache.get(interaction.user.id);
    const connection = joinVoiceChannel( {
        channelId: member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator

    });

    if(member.voice.channel)
    {
        interaction.reply(`You are connected to ${member.voice.channel.name}`);
    }
    else
    {
        interaction.reply(`Youre not connected to a voice channel`);
    }
  }
}