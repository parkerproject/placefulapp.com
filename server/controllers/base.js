'use strict'
require('dotenv').load()
const req = require('request')
const satelize = require('satelize')
const ipify = require('ipify')

class BaseUrl {
  constructor() {
    this.url = `http://api.placeful.co/promotions?key=${process.env.API_KEY}&limit=6&user_id=parker&tab=today`
  }
  render() {
    return this.url
  }
}

module.exports = {
  index: {
    handler: function (request, reply) {
      let baseUrl = new BaseUrl().render()

      ipify((err, ip) => {
        if (err)console.log(err)
        satelize.satelize({ip: ip}, function (error, payload) {
          if (error)console.log(error)
          if (payload != null) {
            let location = `${payload.longitude}, ${payload.latitude}`
            baseUrl = `${baseUrl}&geo=${location}`
          }
          req(baseUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              let promos = JSON.parse(body).results
              reply.view('index', {
                promos: promos
              })
            } else {
              reply.view('index', {})
            }
          })
        })
      })
    }
  },
  fbconfirm: {
    handler: function (request, reply) {
      reply.view('fbconfirm', {
        title: 'Thank you'
      })
    },
    app: {
      name: 'fbconfirm'
    }
  },
  missing: {
    handler: function (request, reply) {
      reply.view('404', {
        title: 'You found a missing page, but won the 404 error!'
      }).code(404)
    },
    app: {
      name: '404'
    }
  },
  business: {
    handler: function (request, reply) {
      return reply.redirect('https://merchant.dealsbox.co')
    },
    app: {
      name: 'business'
    }
  }
}
