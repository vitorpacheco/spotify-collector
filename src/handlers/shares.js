import { parse } from 'spotify-uri'
import { default as SpotifyWebApi } from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

const saveItem = async (db, username, url, body) => {
  db.sharedItems.findOne({ trackId: url.id, username: username }, async (err, item) => {
    if (err) return console.error(err);

    if (item) return

    const newItem = {
      username: username,
      trackId: url.id,
      type: url.type,
      name: body.name,
      uri: body.uri,
      popuplarity: body.popuplarity,
      explicit: body.explicit,
      href: body.href,
      external_ids: body.external_ids,
      external_urls: body.external_urls
    };

    db.sharedItems.insert(newItem)
  })
}

export default async (bot, db) => {
  await spotifyApi.clientCredentialsGrant().then((data) => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    spotifyApi.setAccessToken(data.body['access_token']);
  },
    (err) => {
      console.error('Something went wrong when retrieving an access token', err);
    }
  );

  bot.on('text', async (ctx) => {
    const { text, entities, from } = ctx.message
    const username = from.username

    const urls = (entities || []).filter(entity => entity.type === 'url')
      .map(entity => text.slice(entity.offset, entity.offset + entity.length))

    const parsedUrls = urls.map(url => {
      try {
        return parse(url)
      } catch (error) {
        console.error(error)
      }
    })

    parsedUrls.filter(url => url.type === 'track').map(url => {
      spotifyApi.getTrack(url.id)
        .then((data) => {
          return data.body
        }, (err) => {
          console.error('Something went wrong!', err);
        }).then(body => {
          if (body.is_local) return

          saveItem(db, username, url, body)
        })
    })

    parsedUrls.filter(url => url.type === 'artist').map(url => {
      spotifyApi.getArtist(url.id)
        .then((data) => {
          return data.body
        }, (err) => {
          console.error('Something went wrong!', err);
        }).then(body => {
          if (body.is_local) return

          saveItem(db, username, url, body)
        })
    })

    parsedUrls.filter(url => url.type === 'album').map(url => {
      spotifyApi.getAlbum(url.id)
        .then((data) => {
          return data.body
        }, (err) => {
          console.error('Something went wrong!', err);
        }).then(body => {
          if (body.is_local) return

          saveItem(db, username, url, body)
        })
    })
  })
}