const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const rankColors = [
  {
    rank: "IRON",
    color: 0x524948
  },
  {
    rank: "BRONZE",
    color: 0x633a2d
  },
  {
    rank: "SILVER",
    color: 0x424a4e
  },
  {
    rank: "GOLD",
    color: 0xc08744
  },
  {
    rank: "PLATINUM",
    color: 0x2dcc6b
  },
  {
    rank: "DIAMOND",
    color: 0x7a83b4
  },
  {
    rank: "MASTER",
    color: 0xc625d3
  },
  {
    rank: "GRANDMASTER",
    color: 0xd53836
  },
  {
    rank: "CHALLENGER",
    color: 0x4cafc8
  }
]

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lol")
    .setDescription("Display the League of Legends elo of the Entered Account")
    .addSubcommand(subcommand => 
      subcommand.setName("solo")
        .setDescription("Get your Soloq stats!")
        .addStringOption(option => option.setName("summoner").setDescription("League of Legends summoner name").setRequired(true)))

   ,
  async execute(client, interaction) {
    switch(interaction.options.getSubcommand()) {
      case "solo" : {
        
        break;
      }
    }
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

    const stats = JSON.parse(AccountJsonRes);    
    let SoloQStats;
    try {
      SoloQStats = stats.find(a => a.queueType === "RANKED_SOLO_5x5");
    } catch(error) {
      interaction.reply("No ranked stats found");
      return;
    };
    
    
    if(!SoloQStats) {
      interaction.reply("This person didnt play enough SoloQ games yet!");
      return;
    }
    //console.log(stats);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`SoloQ stats of ${summoner.name}`)
          .setColor(rankColors.find(r => r.rank === SoloQStats.tier).color)
          //.setURL("https://euw.op.gg/summoners/euw/" + summoner.name)
          .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${summoner.profileIconId}.png`)
          .addFields([
            {
              name: `${SoloQStats.tier} ${SoloQStats.rank} ${SoloQStats.leaguePoints}LP`,
              value: `${GetWinrate(SoloQStats.wins, SoloQStats.losses)}%  ${SoloQStats.wins}W  ${SoloQStats.losses}L`
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