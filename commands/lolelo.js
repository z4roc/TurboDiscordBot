const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lolelo")
    .setDescription("Display the League of Legends elo of the Entered Account")
    .addStringOption(option => option.setName("summoner").setDescription("Your League of Legends summoner name").setRequired(true)),
  async execute(client, interaction) {
    let name = interaction.options.getString("summoner");
    const SummonerResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`
      , {
        headers : {
          'Content-Type': 'application/json',
          'X-Riot-Token': process.env.RIOT_KEY
        }
      });
    const SummonerJsonRes = await SummonerResponse.text();
    const summoner = JSON.parse(SummonerJsonRes);
    
    const AccountResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id.toString('base64')}`
        , {
          headers : {
            'Content-Type': 'application/json',
            'X-Riot-Token': process.env.RIOT_KEY  
          }
        }
    );
    const AccountJsonRes = await AccountResponse.text();
    const account = JSON.parse(AccountJsonRes);

    const SoloQStats = account.find(a => a.queueType === "RANKED_SOLO_5x5");
    console.log(SoloQStats.tier);    
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Ranked Stats of ${summoner.name}`)
          .setColor(0x093742)
          .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${summoner.profileIconId}.png`)
          .addFields([
            {
              name: "SOLOQ Stats",
              value: `${SoloQStats.wins}W : ${SoloQStats.losses}L`
            },
            {
              name: `Winrate`,
              value: `${GetWinrate(SoloQStats.wins, SoloQStats.losses)}%`
            }
          ])
          .setImage("https://pf.turbointerl9.repl.co/RankedBadges/Emblem_"+ SoloQStats.tier + ".png")
          .setFooter({text: client.user.username, iconURL: client.user.avatarURL({dynamic: true})})
          .setTimestamp()
    ]});

    
    

  }
};


function GetWinrate(wins, losses) {
  return Math.round((parseInt(wins) / (parseInt(losses) + parseInt(wins))) * 100);
}