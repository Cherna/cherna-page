var $ = require('jquery');
var template = require('./restos.jade');

var restos = function (context, next) {
  $('canvas').hide();
  $('body').append(template());
  console.log('restos');
  console.log(context);
}

module.exports = restos;