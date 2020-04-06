module.exports = () => {
    require('dotenv').config()

    const Telegraf = require('telegraf')
    
    const bot = new Telegraf(process.env.BOT_TOKEN)
    
    bot.telegram.getMe().then((botInfo) => {
        console.log(botInfo)
        bot.options.username = botInfo.username
    })
    
    bot.start((ctx) => ctx.reply('Wellcome!'))
    bot.help((ctx) => ctx.reply('Send me a sticker'))
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.hears('hi', (ctx) => ctx.reply('Hey there'))
    bot.launch()
}