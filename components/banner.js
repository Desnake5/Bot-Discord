
const {  EmbedBuilder } = require('discord.js');

module.exports = async function (user,client,message){
    // Fetch the user's banner
    let userWithBanner = await client.users.fetch(user.id, { force: true });
    let bannerURL = userWithBanner.bannerURL({ dynamic: true, size: 512 });

    // Check if the user has a banner
    if (!bannerURL) {
        // Send a message if the user doesn't have a banner
        const noBannerEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 32 }) })
            .setDescription('This user does not have a banner.')
            .setColor(0xff0000) // Red color to indicate a warning or error
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

        await message.reply({ embeds: [noBannerEmbed] });
        return;
    }

    // Create an embed with the banner image if available
    const bannerEmbed = new EmbedBuilder()
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true, size: 32 }) })
        .setTitle('Banner Link')
        .setURL(bannerURL) // Set the URL to which the title links
        .setColor(0x1e90ff) // You can change the color to whatever you'd like
        .setImage(bannerURL) // Show the banner in the embed
        .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    await message.reply({ embeds: [bannerEmbed] });
}