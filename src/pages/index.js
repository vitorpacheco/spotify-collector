import express from 'express'

export default (env) => {
  const app = express();

  app.set('port', env.PORT || 3000)

  app.get('/api', (req, res) => {
    res.setHeader('Content-type', 'text/html')
    res.setHeader('Cache-control', 's-max-age=1, stale-while-revalidate')
    res.end('Spotify Collector Telegram Bot')
  })

  app.get('/api/item/:slug', (req, res) => {
    const { slug } = req.params
    res.end(`Item: ${slug}`)
  })

  app.listen(app.get('port'), () => {
    console.log(`app listening at ${app.get('port')}`)
  })
}
