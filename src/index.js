import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'

import handlers from './handlers'
import pages from './pages'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.catch(console.error)

bot.use((ctx, next) => {
  console.log(ctx.from)
  next()
})

handlers(bot, process.env);

bot.launch()

pages(process.env)