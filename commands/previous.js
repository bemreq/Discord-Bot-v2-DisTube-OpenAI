module.exports = {
  name: 'previous',
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    const song = queue.previous()
    message.channel.send(`${client.emotes.success} | Now Playing:\n${song.name}`)
  }
}
