import {Composer} from 'telegraf'

const start = `Hi, I was made to help you keep track of songs that are sent to your group by sending them to a channel. To learn my commands, send /help and for a step-by-step guide on how to set me up, send /setup.`

const help = `
<code>/settings</code> - change your groups configuration
`

const setup = `
<b>To set up a channel:</b>
1. Add me to a channel
2. Send <code>@SpotifyCollectorBot</code> to your channel
<b>To set up a group:</b>
1. Add me to a group
3. Choose a channel from the buttons
4. (Optional) send <code>/settings</code> to configure me
`

const extra = {
    parse_mode: `html`,
}

export default bot => {
    bot.start(Composer.privateChat(Composer.reply(start)))
    bot.help(Composer.privateChat(Composer.reply(help, extra)))
    bot.command('setup', Composer.privateChat(Composer.reply(setup, extra)))
}
