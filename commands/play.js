const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayer, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder().setName("play").setDescription("Play the Audio of a Youtube Video!")
    .addStringOption(option => option.setName("url").setDescription("The video url you want to listen to").setRequired(true)),
  async execute(client, interaction) {
  
    const url = interaction.options.getString("url");
    const { voice } = interaction.member;
    if(!voice.channelId) {
      interaction.reply(`Youre not connected to a voice channel`);
        return;  
    }
    
    //'C:/Users/Aktamirov/Music/MP3 Downloader/Mortals.mp3'

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
    interaction.reply('Playing ' + url +  ' in ' + voice.channelId);
    
    player.on("error", () => {
      if(interaction.deferred || interaction.replied) {
        interaction.editReply("An error has occured" + error);
      } else {
        interaction.reply("An error has occured" + error);
      }
    });
    
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("Audio is now Playing");
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    
  }
}