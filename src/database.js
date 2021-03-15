import NeDB from 'nedb'
import * as path from 'path'

const databasePaths = {
  sharedItems: path.join(__dirname, 'stores/shared_items.db')
}

const databases = {
  sharedItems: null
}

export const sharedItems = () => {
  console.log(`Database in path ${databasePaths.sharedItems}`)

  if (databases.sharedItems) return databases.sharedItems

  databases.sharedItems = new NeDB({
    filename: databasePaths.sharedItems,
    autoload: true,
  })

  console.log(`Loaded ${databasePaths.sharedItems} database`)

  return databases.sharedItems
}
