import dotenv from 'dotenv'
import * as path from 'path'
import NeDB from 'nedb'
import { Telegraf } from 'telegraf'
import express from 'express'

import handlers from './handlers'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const db = {
  sharedItems: new NeDB({
    filename: path.join(__dirname, 'stores/shared_items.db'),
    autoload: true
  })
}

bot.catch(console.error)

bot.use((ctx, next) => {
  console.log(ctx.from)
   next()
})

handlers(bot, db, process.env);

bot.launch()

const app = express();

app.set('port', process.env.PORT || 3000)

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