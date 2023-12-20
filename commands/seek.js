module.exports = {
  name: 'seek',
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    if (!args[0]) {
      return message.channel.send(`${client.emotes.error} | Please Provide Position (in seconds) To Seek!`)
    }
    const time = Number(args[0])
    if (isNaN(time)) return message.channel.send(`${client.emotes.error} | Please Enter A Valid Number!`)
    queue.seek(time)
    message.channel.send(`Seeked To: ${time}!`)
  }
}
