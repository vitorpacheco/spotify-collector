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

bot.use(async (ctx, next) => {
  const start = new Date()
  console.log(ctx.from)
  await next()

  const ms = new Date() - start
  console.log('Response time: %sms', ms)
})

handlers(bot, db, process.env);

bot.launch()

const app = express();

app.get('/', (req, res) => {
  res.send('Spotify Collector Telegram Bot')
})

app.listen(process.env.PORT, () => {
  console.log(`app listening at ${process.env.PORT}`)
})