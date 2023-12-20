module.exports = {
  name: 'stop',
  aliases: ['disconnect', 'leave'],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    queue.stop()
    message.channel.send(`${client.emotes.success} | Stopped!`)
  }
}
