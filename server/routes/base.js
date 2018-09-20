

//To connect db
var mysql  = require('mysql');
var conf = require('../common/conf.js').get(process.env.NODE_ENV);
var pool = mysql.createPool(conf.db.db_current);

export const getConnection = (res) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err){
        console.log(err);
        resolve(false);
      }
      resolve(conn);
    });
  });
};

export const _query = (conn, query, param=[]) => {
  return new Promise((resolve, reject) => {
    conn.query(query, param, (err, rows) => {
      if (err){
        var error = {
          code: err.code,
          msg: err.sqlMessage
        }
        resolve(error)
      }
      resolve(rows);
    })
  });
};
