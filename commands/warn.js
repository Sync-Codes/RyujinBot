const Discord = require("discord.js"),
  moment = require("moment");
const mongoose = require("mongoose");
const db = require("../keys.js").MongoURI;
const Warn = require("../models/Warn");

module.exports.run = async (bot, message, args) => {
  // MongoDB Connection
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
  await message.delete();
  if (message.guild.id !== "714798049398095882")
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle("**ERROR**")
        .setDescription(
          `This command is still in development. Only accessible in the [\`support server!\`](https://discord.gg/btKWdJ)`
        )
        .setTimestamp(moment.utc().format())
        .setColor("#ffe66b")
    );
  let wUser = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (wUser.id === message.author.id)
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle("**ERROR**")
        .setDescription("You can't warn yourself!")
        .setTimestamp(moment.utc().format())
        .setColor("#ffe66b")
    );
  if (!wUser)
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle("**ERROR**")
        .setDescription("Can't find user!")
        .setTimestamp(moment.utc().format())
        .setColor("#ffe66b")
    );
  let wReason = args.join(" ").slice(22);
  if (!message.member.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle("**ERROR**")
        .setDescription("You don't have enough permissions to do so!")
        .setTimestamp(moment.utc().format())
        .setColor("#ffe66b")
    );
  if (wUser.hasPermission("MANAGE_MESSAGES"))
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle("**ERROR**")
        .setDescription("You don't have enough permissions to ban them")
        .setTimestamp(moment.utc().format())
        .setColor("#ffe66b")
    );
  let warnEmbed = new Discord.RichEmbed()
    .setTitle("Warn")
    .setColor("#bc0000")
    .setThumbnail(wUser.user.displayAvatarURL)
    .addField("User", `\`${wUser.user.tag}\``)
    .addField("Moderator", `\`${message.author.tag}\``)
    .addField("Reason", `\`${wReason ? wReason : "None."}\``)
    .addField(
      "Time",
      `\`${moment.utc(new Date()).format("dddd, MMMM Do YYYY, HH:mm:ss")}\``
    )
    .setFooter("Developed by Sync#0666", bot.user.displayAvatarURL);
  let logChannel = message.guild.channels.find((c) => c.name === "mod-log");
  if (!logChannel)
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle("**ERROR**")
        .setDescription("Can't find mod-log channel!")
        .setTimestamp(moment.utc().format())
        .setColor("#ffe66b")
    );
  wUser.ban(wReason);
  logChannel.send(warnEmbed);

  const newWarn = new Warn({
    wUserName: wUser.user.tag,
    wUserID: wUser.id,
    moderator: message.author.tag,
    reason: reason,
    date_time: moment.utc(new Date()).format("dddd, MMMM Do YYYY, HH:mm:ss"),
  });

  newWarn.save().then((res) => console.log(res));
  message.channel
  .send(
    new Discord.RichEmbed()
      .setDescription(`Member has been warned!`)
      .setTimestamp(moment.utc().format())
      .setColor("#ffe66b")
  )
  .then((msg) => msg.delete(7500));
};

module.exports.help = {
  name: "warn",
};
