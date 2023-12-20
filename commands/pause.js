module.exports = {
  name: 'pause',
  aliases: ['pause', 'hold'],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    if (queue.paused) {
      queue.resume()
      return message.channel.send('Resumed The Song For You :)')
    }
    queue.pause()
    message.channel.send('Paused The Song For You :)')
  }
}
