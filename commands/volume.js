module.exports = {
  name: 'volume',
  aliases: ['v', 'set', 'set-volume'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    const volume = parseInt(args[0])
    if (isNaN(volume)) return message.channel.send(`${client.emotes.error} | Please Enter A Valid Number!`)
    queue.setVolume(volume)
    message.channel.send(`${client.emotes.success} | Volume Set To: \`${volume}\``)
  }
}
