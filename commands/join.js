const { Constants } = require('discord.js')

module.exports = {
  name: 'join',
  aliases: ['move'],
  run: async (client, message, args) => {
    let voiceChannel = message.member.voice.channel
    if (args[0]) {
      voiceChannel = await client.channels.fetch(args[0])
      if (!Constants.VoiceBasedChannelTypes.includes(voiceChannel?.type)) {
        return message.channel.send(`${client.emotes.error} | ${args[0]} Is Not A Valid Voice Channel!`)
      }
    }
    if (!voiceChannel) {
      return message.channel.send(
        `${client.emotes.error} | You Must Be In A Voice Channel Or Enter A Voice Channel ID!`
      )
    }
    client.distube.voices.join(voiceChannel)
  }
}
