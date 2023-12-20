require("dotenv/config");
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { DisTube } = require('distube');
const { OpenAI } = require('openai');

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
  ]
});

const fs = require('fs');
const config = require('./config.json');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

client.DisTube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
      new SpotifyPlugin({
          emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
  ]
});
client.distube = client.DisTube; 
client.commands = new Collection();
client.aliases = new Collection();
client.emotes = config.emoji;

fs.readdir('./commands/', (err, files) => {
    if (err) return console.log("Could'nt Find Any Commands!");
    const jsFiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsFiles.length <= 0) return console.log("Could'nt Find Any Commands!");
    jsFiles.forEach(file => {
        const cmd = require(`./commands/${file}`);
        console.log(`Loaded ${file}`);
        client.commands.set(cmd.name, cmd);
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name));
    });
});

const prefix = config.prefix;
const CHANNELS = ['Your Discord Channel ID for Bot.'];

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

client.on('ready', () => {
    console.log("The Bot Is Online!");
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!CHANNELS.includes(message.channelId) && !message.mentions.users.has(client.user.id)) return;
    await message.channel.sendTyping();
    const sendTypingInterval = setInterval(() => {
      message.channel.sendTyping();
  }, 5000);

  let conversation = [];

  conversation.push({
      role: 'system',
      content: "I'm A Friendly Chatbot And Here For Help :)"
  })

  let prevMessages = await message.channel.messages.fetch({ limit: 10 });
  prevMessages.reverse();

  prevMessages.forEach((msg) => {
      if (msg.author.bot && msg.author.id !== client.user.id) return;

      const username = msg.author.username.replace(/\s+/g, '_').replace(/[^\w\s]/gi, '');

      if (msg.author.id === client.user.id) {
          conversation.push({
              role: 'assistant',
              name: username,
              content: msg.content,
          });

          return;
      }

      conversation.push({
          role: 'user',
          name: username,
          content: msg.content,
      });
  })

  const response = await  openai.chat.completions
      .create({
          model: 'gpt-3.5-turbo',
          messages: conversation,
      })
      .catch((error) => console.error('OpenAI Error:\n', error));
  
  clearInterval(sendTypingInterval);

  if(!response) {
      message.reply('I Have Some Trouble With OpenAI API. Try Again In A Moment.');
      return;
  }
  
  const responseMessage = response.choices[0].message.content;
  const chunkSizeLimit = 2000;

  for (let i = 0; i < responseMessage.length; i += chunkSizeLimit) {
      const chunk = responseMessage.substring(i, i + chunkSizeLimit);
  
      await message.reply(chunk);
  }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;
    if (cmd.inVoiceChannel && !message.member.voice.channel) {
        return message.channel.send(`${client.emotes.error} | You Must Be İn A Voice Channel!`);
    }
    try {
        cmd.run(client, message, args);
    } catch (e) {
        console.error(e);
        message.channel.send(`${client.emotes.error} | Error: \`${e}\``);
    }
});

const status = queue =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
      queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

    client.distube.on('playSong', (queue, song) =>
    queue.textChannel.send(
        `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested By: ${
        song.user
        }\n${status(queue)}`
    )
);

client.distube.on('addSong', (queue, song) =>
    queue.textChannel.send(
        `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` To The Queue By: ${song.user}`
    )
);

client.distube.on('addList', (queue, playlist) =>
    queue.textChannel.send(
        `${client.emotes.success} | Added \`${playlist.name}\` Playlist (${
        playlist.songs.length
        } songs) To Queue\n${status(queue)}`
    )
);

client.distube.on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An Error Encountered: ${e.toString().slice(0, 1974)}`);
    else console.error(e);
});

client.distube.on('empty', channel => channel.send('Voice Channel İs Empty! Leaving The Channel...'));

client.distube.on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No Result Found For: \`${query}\`!`)
);

client.distube.on('finish', queue => queue.textChannel.send('Finished!'));

client.login(process.env.TOKEN);