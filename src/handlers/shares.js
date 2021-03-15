import { parse } from 'spotify-uri'
import { default as SpotifyWebApi } from 'spotify-web-api-node'
import { v4 as uuidv4 } from 'uuid'
import { saveItem, getItemByTrackId } from '../services/itemsService'

const persistItem = async (username, url, body) => {
  const item = await getItemByTrackId(url.id)

  if (item) return

  const result = await saveItem({
    id: uuidv4(),
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
  })

  return result
}

export default async (bot, env) => {
  const spotifyApi = new SpotifyWebApi({
    clientId: env.SPOTIFY_CLIENT_ID,
    clientSecret: env.SPOTIFY_CLIENT_SECRET
  })

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

          persistItem(username, url, body)
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

          persistItem(username, url, body)
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

          persistItem(username, url, body)
        })
    })
  })
}