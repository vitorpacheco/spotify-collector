module.exports = async () => {
    

    const Telegraf = require('telegraf')
    const SpotifyWebApi = require('spotify-web-api-node')
    const SpotifyUri = require('spotify-uri');

    const playlistId = '5dtxGsCliEFZHU7U0FfFAa'

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET
    })

    await spotifyApi.clientCredentialsGrant().then(
        (data) => {
          console.log('The access token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
      
          // Save the access token so that it's used in future calls
          console.log('a')
          spotifyApi.setAccessToken(data.body['access_token']);
          console.log('b')
        },
        (err) => {
          console.log('Something went wrong when retrieving an access token', err);
        }
      );

    
    const bot = new Telegraf(process.env.BOT_TOKEN)
    
    bot.telegram.getMe().then((botInfo) => {
        console.log(botInfo)
        bot.options.username = botInfo.username
    })

    bot.use(async (ctx, next) => {
        const start = new Date()
        
        await next()

        const ms = new Date() - start
        console.log('Response time: %sms', ms)
    })

    bot.on('text', (ctx) => {
        console.log(ctx.message)

        const text = ctx.message.text
        const username = ctx.message.from.username

        if (ctx.message.entities !== undefined) {
            const urlEntities = ctx.message.entities.filter(entity => {
                if (entity.type === 'url') {
                    return entity
                }
            });

            urlEntities.forEach(async entity => {
                console.log(entity)

                const url = text.substring(entity.offset, entity.length)

                console.log(url)

                try {
                    const parsed = SpotifyUri.parse(url)
                 
                    console.log(parsed);

                    if (parsed.type !== 'track') {
                        return
                    }

                    await spotifyApi.getUserPlaylists('vitorpacheco')
                        .then((data) => {
                            console.log('Found playlists are', data.body)
                        }, (err) => {
                            console.log('Something went wrong!', err)  
                        })

                    // await spotifyApi.createPlaylist('MTH - ' + username, { public: true })
                    //     .then((data) => {
                    //         console.log('Created playlist!', data.body);
                    //     }, (err) => {
                    //         console.log('Something went wrong!', err);
                    //     })

                    // await spotifyApi.addTracksToPlaylist(playlistId, ['spotify:track:' + parsed.id])
                    //     .then((data) => {
                    //         console.log('Added tracks to playlist!');
                    //     }, (err) => {
                    //         console.log('Something went wrong!', err);
                    //     });
                } catch (err) {
                    console.log('Failed to parse track url', err)
                }
            })

            ctx.reply('Hello World')
        }
    })
    
    bot.start((ctx) => ctx.reply('Wellcome!'))
    bot.help((ctx) => ctx.reply('Send me a sticker'))
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.hears('hi', (ctx) => ctx.reply('Hey there'))

    bot.command('oldschool', (ctx) => ctx.reply('Hello'))
    bot.command('modern', ({ reply }) => reply('Yo'))
    bot.command('hipster', Telegraf.reply('λ'))

    bot.launch()
}