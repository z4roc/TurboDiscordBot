const { SlashCommandBuilder, Client, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get your Account Information!")
    .addSubcommand(subCommand => subCommand.setName("server").setDescription("Get the Servers information!"))
    .addSubcommand(subCommand => subCommand.setName("user").setDescription("Get your Account Information!")
      .addUserOption(option => option.setName("user").setDescription("The User").setRequired(true))),
  async execute(client, interaction) {
    
    switch(interaction.options.getSubcommand()) {
      case "server": {
        const roleList = interaction.guild.roles.cache;
        interaction.reply( {
          embeds: [
            new EmbedBuilder()
              .setTitle(`Server Information about ${interaction.guild.name}`)
              .setThumbnail(interaction.guild.iconURL({dynamic: true}))
              .addFields([
                {
                  name: "Channels",
                  value: `${interaction.guild.channels.cache.size} Channels`
                },
                {
                  name: "Roles",
                  value: `${interaction.guild.roles.cache.size}`
                },
                {
                  name: "Created At",
                  value: `<t:${Math.round(interaction.guild.createdTimestamp/1000)}>`,
                  inline: true
                }

              ])
          ]
        });
        break;
      }
      case "user": {
        const usr = interaction.options.getMember("user")
        interaction.reply( {
          embeds: [
            new EmbedBuilder()
              .setTitle(`User Information about ${usr.user.tag}`)
              .setThumbnail(usr.user.avatarURL( {
                dynamic: true  
              }))
              .addFields([
                {
                  name: "Created At",
                  value: `<t:${Math.round(usr.user.createdTimestamp/1000)}>`,
                  inline: true
                }
              ])
          ]
        });
        break;
      } 
    }
  }
}