const handlers = [
    'help',
    'shares'
]

export default (bot, db) => handlers.forEach(handler => require(`./${handler}`)(bot, db))
