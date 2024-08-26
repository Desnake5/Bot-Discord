
const {  EmbedBuilder, AuditLogEvent } = require('discord.js');

module.exports = async function (message){
    
    try {
        // Determine if there's a mention in the message
        const mentionedMember = message.mentions.members.first();
        const member = mentionedMember || message.member; // Default to the message author if no mention

        if (!member) {
            return message.channel.send('Could not find the mentioned user.');
        }

        // Find the "verified" role
        const verificationRole = member.roles.cache.find(role => role.name.toLowerCase().includes('verified'));

        let verifier = 'Unknown'; // Default verifier if none found
        if (verificationRole) {
            // Fetch audit logs to determine who gave the role
            const auditLogs = await message.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberRoleUpdate,
                limit: 10
            });

            const logEntry = auditLogs.entries.find(entry =>
                entry.target.id === member.id &&
                entry.changes.some(change => change.key === '$add' && change.new.some(r => r.id === verificationRole.id))
            );

            if (logEntry) {
                verifier = logEntry.executor.tag;
            }
        }

        // Build the roles display with their colors
        const rolesDisplay = member.roles.cache
            .filter(role => role.name !== '@everyone') // Exclude the @everyone role
            .map(role => {
                const roleColor = role.hexColor === '#000000' ? '#ffffff' : role.hexColor; // Default to white if the role has no color
                return `<span style="color:${roleColor}">${role.name}</span>`; // This is a hypothetical representation. Discord.js cannot display text in color.
            })
            .join(', ');

        // Create an embed with member information
        const embed = new EmbedBuilder()
            .setColor('#0099ff') // Set a primary color for the embed
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: member.user.username, inline: false },
                { name: 'User ID', value: member.user.id, inline: true },
                { name: 'Joined Discord', value: `${new Date(member.user.createdTimestamp).toDateString()}`, inline: true },
                { name: 'Joined Server', value: `${new Date(member.joinedTimestamp).toDateString()}`, inline: true },
                { name: 'Roles', value: rolesDisplay || '@everyone', inline: false },
                { name: 'Verified', value: `Yes, verified by ${verifier}`, inline: true }
            )
            .setFooter({ text: 'Invites: 0', iconURL: 'https://some.url/to/icon.png' }) // Example footer text
            .setTimestamp();

        // Send the embed to the channel
        await message.channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Error fetching member or sending embed:', error);
    }

}