module.exports = {
  name: 'filter',
  aliases: ['filters'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There Is Nothing In The Queue Right Now!`)
    const filter = args[0]
    if (filter === 'off' && queue.filters.size) queue.filters.clear()
    else if (Object.keys(client.distube.filters).includes(filter)) {
      if (queue.filters.has(filter)) queue.filters.remove(filter)
      else queue.filters.add(filter)
    } else if (args[0]) return message.channel.send(`${client.emotes.error} | Not A Valid Filter`)
    message.channel.send(`Current Queue Filter: \`${queue.filters.names.join(', ') || 'Off'}\``)
  }
}
