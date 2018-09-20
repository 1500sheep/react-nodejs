import tool from 'cloneextend'
var conf = {}

conf.defaults = {

	application: {
		routes : [
							 'db_user'
			       ]
	},

	server: {
		host : 'localhost',
		port : 7510,
	},

	db: {
		db_current: {
		 	host: "59.17.74.247",
			port: 3300,
			user: "fifty_intern",
			password: "rkdtjrdbs1234",
			database: 'test_insta'
		}
	},
}
/*
var db_conn = {
	db_connection: conf.db_conn_conf.test_gidon_connection,
}
*/

exports.get = (env, obj) => {
  var settings = tool.cloneextend(conf.defaults, conf[env]);
  return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
