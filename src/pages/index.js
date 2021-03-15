import express from 'express'
import { getItem, getAll } from '../services/itemsService'

export default (env) => {
  const app = express();

  app.set('port', env.PORT || 3000)

  app.get('/api', (req, res) => {
    res.setHeader('Content-type', 'application/json')
    res.setHeader('Cache-control', 's-max-age=1, stale-while-revalidate')
    res.json({
      'description': 'Spotify Collector Telegram Bot'
    })
  })

  app.get('/api/items', async (req, res) => {
    getAll({}).then((items) => {
      res.json({
        data: items
      })
    })
  });

  app.get('/api/items/:uuid', (req, res) => {
    const { uuid } = req.params

    getItem(uuid)
      .then((item) => {
        if (!item) {
          res.status(404)
        }
  
        res.json(item)
      }
    )
  })

  app.listen(app.get('port'), () => {
    console.log(`app listening at ${app.get('port')}`)
  })
}
