/**
 * Dependencies.
 */
var requireDirectory = require('require-directory')

module.exports = function (server) {
  // Bootstrap your controllers so you dont have to load them individually. This loads them all into the controller name space. https://github.com/troygoode/node-require-directory
  var controller = requireDirectory(module, '../controllers')

  // Array of routes for Hapi
  var routeTable = [{
    method: 'GET',
    path: '/',
    config: controller.base.index
  }, {
    method: 'GET',
    path: '/{path*}',
    config: controller.base.missing
  }, {
    method: 'GET',
    path: '/partials/{path*}',
    config: controller.assets.partials
  }, {
    method: 'GET',
    path: '/images/{path*}',
    config: controller.assets.images
  }, {
    method: 'GET',
    path: '/deal_images/{path*}',
    config: controller.assets.deal_images
  }, {
    method: 'GET',
    path: '/css/{path*}',
    config: controller.assets.css
  }, {
    method: 'GET',
    path: '/cs/{path*}',
    config: controller.assets.cs
  }, {
    method: 'GET',
    path: '/fonts/{path*}',
    config: controller.assets.fonts
  }, {
    method: 'GET',
    path: '/js/{path*}',
    config: controller.assets.js
  }, {
    method: 'GET',
    path: '/bower_components/{path*}',
    config: controller.assets.bower
  }, {
    method: 'GET',
    path: '/merchant/{path*}',
    config: controller.assets.merchant
  }, {
    method: 'POST',
    path: '/process_email/{email*2}',
    config: controller.email.storeEmail
  }, {
    method: 'POST',
    path: '/welcome_email',
    config: controller.email.welcomeEmail
  }, {
    method: 'GET',
    path: '/terms',
    config: controller.static.terms
  }, {
    method: 'GET',
    path: '/privacy',
    config: controller.static.privacy
  }, {
    method: 'GET',
    path: '/about',
    config: controller.static.about
  }, {
    method: 'GET',
    path: '/recommended',
    config: controller.prediction.like
  }, {
    method: 'GET',
    path: '/alerts',
    config: controller.static.alerts
  }, {
    method: 'GET',
    path: '/deals/feed.xml',
    config: controller.rss.main
  }, {
    method: 'GET',
    path: '/deals-services/feed.xml',
    config: controller.services_rss.main
  }, {
    method: 'GET',
    path: '/deals-food/feed.xml',
    config: controller.food_rss.main
  }, {
    method: 'GET',
    path: '/deals-shopping/feed.xml',
    config: controller.shopping_rss.main
  }, {
    method: 'GET',
    path: '/deals-health/feed.xml',
    config: controller.health_rss.main
  }, {
    method: 'GET',
    path: '/deals-activities/feed.xml',
    config: controller.activities_rss.main
  }, {
    method: 'POST',
    path: '/lab/payment',
    config: controller.payment.index
  }, {
    method: 'GET',
    path: '/user/coupon',
    config: controller.coupon.index
  }, {
    method: 'GET',
    path: '/promotion/{promotion_id}/{slug}',
    config: controller.deal.index
  }, {
    method: 'GET',
    path: '/business',
    config: controller.base.business
  }, {
    method: 'POST',
    path: '/webhook/view',
    config: controller.webhook.index
  }, {
    method: 'POST',
    path: '/webhook/follow',
    config: controller.webhook.index
  }, {
    method: 'POST',
    path: '/webhook/unfollow',
    config: controller.webhook.index
  }, {
    method: 'POST',
    path: '/webhook/like',
    config: controller.webhook.index
  }, {
    method: 'POST',
    path: '/webhook/unlike',
    config: controller.webhook.index
  }, {
    method: 'POST',
    path: '/webhook/join',
    config: controller.webhook.index
  }, {
    method: 'POST',
    path: '/webhook/share',
    config: controller.webhook.index
  }, {
    method: 'GET',
    path: '/contest',
    config: controller.promo.index
  }]
  return routeTable
}
