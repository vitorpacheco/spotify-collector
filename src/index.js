import dotenv from 'dotenv'
import * as path from 'path'
import NeDB from 'nedb'
import Telegraf from 'telegraf'

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

handlers(bot, db);

bot.launch()