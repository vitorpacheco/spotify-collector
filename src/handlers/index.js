import help from './help'
import shares from './shares'

export default (bot, db) => {
  help(bot)
  shares(bot, db)
}
