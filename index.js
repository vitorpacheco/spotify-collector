import dotenv from 'dotenv'
import * as path from 'path'
import NeDB from 'nedb'
import Telegraf from 'telegraf'

import handlers from './handlers'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const db = {
    channels: new NeDB({
        filename: path.join(__dirname, 'stores/channels.db'),
        autoload: true
    }),
    groups: new NeDB({
        filename: path.join(__dirname, 'stores/groups.db'),
        autoload: true
    }),
    messages: new NeDB({
        filename: path.join(__dirname, 'stores/messages.db'),
        autoload: true
    }),
    likes: new NeDB({
        filename: path.join(__dirname, 'stores/likes.db'),
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