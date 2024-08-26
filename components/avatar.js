
const {  EmbedBuilder } = require('discord.js');

module.exports = async function (user,message){
      // Handle avatar request
      let avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });
      const avatarEmbed = new EmbedBuilder()
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 32 }) })
          .setTitle('Avatar Link')
          .setURL(avatarURL) // Set the URL to which the title links
          .setColor(0x008080) // You can change the color to whatever you'd like
          .setImage(avatarURL) // Show the avatar in the embed
          .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

      await message.reply({ embeds: [avatarEmbed] });
}