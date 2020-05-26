const Discord = require("discord.js");
const malScraper = require("mal-scraper");
const moment = require("moment");

module.exports.run = async (bot, message, args) => {
  let query = args.join(" ");
  console.log(query);
  //   if (!query || args.length === 0) {
  //     return message.channel.send(
  //       {
  //           embed = {
  //         title: "**ERROR - Missing Parameters!**",
  //         fields: [
  //           {
  //             name: "Usage",
  //             value: "`r@anime <search query>`",
  //             inline: true,
  //           }
  //         ]
  //     }
  // })
  //   } else {
  try {
    malScraper.getInfoFromName(query).then((data) => {
      const embed = new Discord.RichEmbed()
        .setTimestamp(moment.utc().format())
        .setFooter("Information supplied by MyAnimeList API")
        .setTitle(data.title)
        .setURL(data.url)
        .setColor("#ff1453")
        .setThumbnail(data.picture)
        .addField("English Title", data.englishTitle, true)
        .addField("Genres", data.genres.toString(), true)
        .addField("Episodes", data.episodes, true)
        .addField("Aired", data.aired, true)
        .addField("Status", data.status, true)
        .addField("Score", data.score, true)
        .addField("Rank", data.ranked, true)
        .addField("Studio(s)", data.studios.toString(), true)
        .setDescription(`**Synopsis:**\n${data.synopsis.slice(0, -25)}`)

      message.channel.send(embed);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.help = {
  name: "anime",
};
