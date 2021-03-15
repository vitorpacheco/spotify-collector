import { sharedItems } from '../database'

const db = sharedItems()

export const saveItem = (item) => {
  return db.insert(item)
}

export const getItem = (uuid) => {
  console.log(`Find item by UUID: ${uuid}`)

  return new Promise((resolve, reject) => {
    db.findOne({ id: uuid }, function (err, doc) {
      if (err) {
        console.error(err)
        reject(err)
      }
    
      resolve(doc)
    })
  })

} 

export const getItemByTrackId = (trackId) => {
  console.log(`Find item by Track ID: ${trackId}`)

  return new Promise((resolve, reject) => {
    db.findOne({ trackId: trackId }, (err, doc) => {
      if (err) {
        console.error(err)
        reject(err)
      }
    
      resolve(doc)
    })
  })
}

export const getAll = (filter) => {
  console.log('Find all items')

  return new Promise((resolve, reject) => {
    db.find(filter, (err, docs) => {
      if (err) {
        console.error(err)
        reject(err)
      }
    
      resolve(docs)
    }) 
  })
}