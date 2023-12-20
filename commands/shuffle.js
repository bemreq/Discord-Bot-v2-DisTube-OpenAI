module.exports = {
  name: 'shuffle',
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    queue.shuffle()
  message.channel.send('Shuffled Songs In The Queue.')
  }
}
