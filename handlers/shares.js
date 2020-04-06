import {SpotifyUri}  from 'spotify-uri'

export default (bot, db) => {
    bot.on('text', (ctx) => {
        console.log(ctx.message)

        const { text, entities, from } = ctx.message
        const username = from.username

        const urls = (entities || []).filter(entity => entity.type === 'url')
            .map(entity => text.slice(entity.offset + 1, entity.offset + entity.length))

        console.log(urls)
        console.log(username)

        const parsedUrls = urls.map(url => {
            try {
                return SpotifyUri.parse(urls)
            } catch (error) {
                console.log(error)
            }
            
        })

        console.log(parsedUrls)

        if (ctx.message.entities !== undefined) {
            // const urlEntities = ctx.message.entities.filter(entity => {
            //     if (entity.type === 'url') {
            //         return entity
            //     }
            // });

            

            // urlEntities.forEach(async entity => {
            //     console.log(entity)

            //     const url = text.substring(entity.offset, entity.length)

            //     console.log(url)

            //     try {
            //         const parsed = SpotifyUri.parse(url)
                 
            //         console.log(parsed);

            //         if (parsed.type !== 'track') {
            //             return
            //         }

            //         await spotifyApi.getUserPlaylists('vitorpacheco')
            //             .then((data) => {
            //                 console.log('Found playlists are', data.body)
            //             }, (err) => {
            //                 console.log('Something went wrong!', err)  
            //             })

            //         // await spotifyApi.createPlaylist('MTH - ' + username, { public: true })
            //         //     .then((data) => {
            //         //         console.log('Created playlist!', data.body);
            //         //     }, (err) => {
            //         //         console.log('Something went wrong!', err);
            //         //     })

            //         // await spotifyApi.addTracksToPlaylist(playlistId, ['spotify:track:' + parsed.id])
            //         //     .then((data) => {
            //         //         console.log('Added tracks to playlist!');
            //         //     }, (err) => {
            //         //         console.log('Something went wrong!', err);
            //         //     });
            //     } catch (err) {
            //         console.log('Failed to parse track url', err)
            //     }
            // })

            // ctx.reply('Hello World')
        }
    })
}