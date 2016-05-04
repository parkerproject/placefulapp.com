'use strict'
require('dotenv').load()
const collections = ['webhook', 'promotions', 'test']
const db = require('mongojs').connect(process.env.DEALSBOX_MONGODB_URL, collections)
// var intercom = require('intercom.io')
const Keen = require('keen-js')
const client = new Keen({
  projectId: process.env.KEEN_PROJECTID,
  writeKey: process.env.KEEN_WRITEKEY
})

let score = 1

module.exports = {
  index: {
    handler: function (request, reply) {
      let data = request.payload.data ? request.payload.data.item.metadata : ''
      db.test.save(request.payload)
      if (data == null) {
        reply('no data')
      }

      if (data) {
        data.keen = {
          timestamp: new Date().toISOString()
        }
      }

      db.promotions.find({
        deal_id: data.deal_id
      }).limit(1, function (err, result) {
        if (err) console.log(err)
        db.webhook.find({
          deal_id: data.deal_id
        }).limit(1, function (err, deal) {
          if (err) console.log(err)
          if (deal.length === 0) {
            result[0].score = score
            result[0].event = 'views'

            delete result[0]['_id']

            db.webhook.save(result[0])

            client.addEvent('views', result, function (err, res) {
              if (err) {
                console.log(err)
              } else {
                reply('success')
              }
            })
          } else {
            db.webhook.findAndModify({
              query: {
                deal_id: data.deal_id
              },
              update: {
                $inc: {
                  score: score
                }
              },
              new: true
            }, function (err, doc, lastErrorObject) {
              if (err) console.log(err)
              reply('update successful')
            })
          }
        })
      })
    }
  }
}
