const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const rankColors = [
  {
    rank: "Iron",
    color: 0x3b3b3b
  },
  {
    rank: "Bronze",
    color: 0x53370a
  },
  {
    rank: "Silver",
    color: 0x919390
  },
  {
    rank: "Gold",
    color: 0xd9861b
  },
  {
    rank: "Platinum",
    color: 0x389fad
  },
  {
    rank: "Diamond",
    color: 0xa672f0
  },
  {
    rank: "Ascendant",
    color: 0x22a660
  },
  {
    rank: "Immortal",
    color: 0xb03370
  },
  {
    rank: "Radiant",
    color: 0xfcf4ba
  }
]

module.exports = {
  data: new SlashCommandBuilder().setName("valo").setDescription("Valorant commands")
    .addSubcommand(command => 
      command.setName("account").setDescription("Get your Valorant account details!")
        .addStringOption(option => option.setName("name").setDescription("Your display name ingame").setRequired(true))
        .addStringOption(option => option.setName("tag").setDescription("Your tagline").setRequired(true))),
  async execute(client, interaction) {
    const name = interaction.options.getString("name");
    const tag = interaction.options.getString("tag");

    switch(interaction.options.getSubcommand()) {
      case "account": {

        const acres = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}`);
        const acresjson = await acres.text();
        const account = JSON.parse(acresjson);

        const rankres = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr-history/${account.data.region}/${name}/${tag}`);
        const rankresjson = await rankres.text();
        const rank = JSON.parse(rankresjson);


        interaction.reply({ embeds:  [
          new EmbedBuilder()
            .setTitle(`Account details of ${name}#${tag}`)
            .setTimestamp()
            .setColor(rankColors.find(r => r.rank === rank.data[0].currenttierpatched.split(' ')[0]).color)
            .setThumbnail(account.data.card.small)
            .addFields([
              {
                name: "LEVEL " + account.data.account_level,
                value: "Last competetive game: " + rank.data[0].date
              },
              {
                name: rank.data[0].currenttierpatched,
                value: parseInt(rank.data[0].elo) % 100 + " RP"
              }
            ])
            .setImage(rank.data[0].images.small)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.avatarURL({dynamic: true})})
        ]});
      }
    }
  }
}