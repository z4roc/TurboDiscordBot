const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayer, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioPlayerError, NoSubscriberBehavior } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const play = require('play-dl');

module.exports = {
  data: new SlashCommandBuilder().setName("play").setDescription("Play the Audio of a Youtube Video!")
    .addStringOption(option => option.setName("url").setDescription("The video url you want to listen to").setRequired(true)),
  async execute(client, interaction) {

    const url = interaction.options.getString("url");

    try {
      if(!url.includes('youtube')) {
        await interaction.reply('No valid URL entered');
        return;
      }
      let valid = new URL(url);
    } catch(_) {
      await interaction.reply(`No valid URL entered`);
      return;
    }
    const { voice } = interaction.member;
    if(!voice.channelId) {
      interaction.reply(`Youre not connected to a voice channel`);
      return;  
    }
    //await play.refreshToken()
    
    //'C:/Users/Aktamirov/Music/MP3 Downloader/Mortals.mp3'

    const player = createAudioPlayer( {
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play
      }
    });

    let stream = await play.stream(url);

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    const connection = joinVoiceChannel( {
      channelId: voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    player.play(resource);
    connection.subscribe(player);
    interaction.reply('Playing ' + url +  ' in ' + voice.channel.name);
    
    player.on("error", (error) => {
      if(interaction.deferred || interaction.replied) {
        interaction.editReply("An error has occured" + error.message);
      } else {
        interaction.reply("An error has occured" + error.message);
      }
    });
    
    player.on(AudioPlayerStatus.Playing, () => {
      console.log("Playing " + url + " requested by " + interaction.member.user.username);
    });

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    
  }
}

