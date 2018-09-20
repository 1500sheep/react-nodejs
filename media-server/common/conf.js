import tool from 'cloneextend'
var conf = {}

conf.defaults = {

    server: {
        host : 'localhost',
        port : 7401,
    },

}

exports.get = (env, obj) => {
  var settings = tool.cloneextend(conf.defaults, conf[env]);
  return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
