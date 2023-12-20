module.exports = {
  name: 'resume',
  aliases: ['resume', 'unpause'],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    if (queue.paused) {
      queue.resume()
      message.channel.send('Resumed The Song For You :)')
    } else {
      message.channel.send('The Queue Is Not Paused!')
    }
  }
}
