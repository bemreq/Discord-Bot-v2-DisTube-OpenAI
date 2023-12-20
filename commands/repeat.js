module.exports = {
  name: 'repeat',
  aliases: ['loop', 'rp'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing Playing!`)
    let mode = null
    switch (args[0]) {
      case 'Off':
        mode = 0
        break
      case 'Song':
        mode = 1
        break
      case 'Queue':
        mode = 2
        break
    }
    mode = queue.setRepeatMode(mode)
    mode = mode ? (mode === 2 ? 'Repeat Queue' : 'Repeat Song') : 'Off'
    message.channel.send(`${client.emotes.repeat} | Set Repeat Mode To: \`${mode}\``)
  }
}
