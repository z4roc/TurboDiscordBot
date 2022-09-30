const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayer, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {} = require('youtube-audio-stream');

module.exports = {
  data: new SlashCommandBuilder().setName("play").setDescription("Pong!"),
  async execute(client, interaction) {
  
    //https://www.youtube.com/watch?v=BmbM5B4NjxY
    const { voice } = interaction.member;
    if(!voice.channelId) {
      interaction.reply(`Youre not connected to a voice channel`);
        return;  
    }

    const player  = createAudioPlayer();
    const resource = createAudioResource('C:/Users/Aktamirov/Music/MP3 Downloader/Mortals.mp3');

    const connection = joinVoiceChannel( {
      channelId: voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    
    connection.subscribe(player);
    player.play(resource);
    interaction.reply('Playing Mortals in ' + voice.channelId);
    
    
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("Music is playing");
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    
  }
}