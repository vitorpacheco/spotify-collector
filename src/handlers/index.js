import help from './help'
import shares from './shares'

export default (bot, env) => {
  help(bot)
  shares(bot, env)
}
