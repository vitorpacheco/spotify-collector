import help from './help'
import shares from './shares'

export default (bot, db, env) => {
  help(bot)
  shares(bot, db, env)
}
