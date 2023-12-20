module.exports = {
  name: 'skipto',
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    if (!args[0]) {
      return message.channel.send(`${client.emotes.error} | Please Provide Time (in seconds) To Go Rewind!`)
    }
    const num = Number(args[0])
    if (isNaN(num)) return message.channel.send(`${client.emotes.error} | Please Enter A Valid Number!`)
    await client.distube.jump(message, num).then(song => {
      message.channel.send({ content: `Skipped To: ${song.name}` })
    })
  }
}
