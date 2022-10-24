const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName("cook").setDescription("Helps you with your food choices!"),
  async execute(client, interaction) {
    var req = await fetch('https://api.spoonacular.com/recipes/random?number=1', {
        headers: {
            'x-api-key': process.env.FOOD_KEY
        }
    });

    var req_json = await req.text();
    var receipe_data = JSON.parse(req_json);

    var recipe = receipe_data.recipes[0];

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`Your lunch today is: ${recipe.title}`)
                .setURL(recipe.sourceUrl)
                .setImage(recipe.image)
                .setDescription(recipe.instructions)
        ]
    })
  }
}