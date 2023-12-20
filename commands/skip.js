module.exports = {
  name: 'skip',
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    try {
      const song = await queue.skip()
      message.channel.send(`${client.emotes.success} | Skipped! Now Playing:\n${song.name}`)
    } catch (e) {
      message.channel.send(`${client.emotes.error} | ${e}`)
    }
  }
}
