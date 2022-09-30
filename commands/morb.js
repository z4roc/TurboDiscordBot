const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayer, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder().setName("morb").setDescription("AAUUUUUGGGGGGHHHHH"),
  async execute(client, interaction) {
    const url = "https://www.youtube.com/watch?v=BmbM5B4NjxY";
    const { voice } = interaction.member;
    const player  = createAudioPlayer();

    const stream = ytdl(url, { filter: 'audioonly'} );

    const resource = createAudioResource(stream);

    const connection = joinVoiceChannel( {
      channelId: voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    player.play(resource);
    connection.subscribe(player);
    interaction.reply("morb!");

    player.on("error", (error) => {
      if(interaction.deferred || interaction.replied) {
        interaction.editReply("An error has occured" + error);
      } else {
        interaction.reply("An error has occured" + error);
      }
    });
    
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("Someone is getting morbed");
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    
  }
}