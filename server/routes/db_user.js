import co from 'co';
import jwt from 'jsonwebtoken';

import { INTERVAL } from '../common/constants.js';

import {
    SECRET_KEY_LENGTH,
    TOKEN_EXPIRY_TIME,
} from '../common/settings';
import {
  get_random_string,
  string_to_hash,
  verify_hash,

} from '../common/utils';


var express = require('express');
var router = express.Router();

const { 
  getConnection,
  _query,
} = require('./base.js');


////////////////////////////////////////////////////
//    유저 회원가입
////////////////////////////////////////////////////

//    가입 체크 
router.post('/user/check/', co.wrap(function* (req, res){

  const { email }       = req.body;

  console.log("email : ",email)
  if( !email ){
      var result = JSON.stringify({
          status: 0,
          results:"no"
      });
      return res.json(result);
  }



  const checkQuery      = 'SELECT * FROM user_auth WHERE  email = ?';

  const conn      = yield getConnection(res);

   if( conn.code ) {
       var result = JSON.stringify({
           status: 0,
           results:"server connection error"
       });
       return res.json(result);
   }

  var rows = yield _query(conn, checkQuery, [email]);


  // 이런식으로 데이터 조회 확인 값 유무를 비교 할 수 있다!
  if(rows[0]==null){
      var result = JSON.stringify({
          status: 200,
          results:"nothing"
      });
      return res.json(result);
  }else{
      var result = JSON.stringify({
          status: 200,
          results:"existing"
      });
      return res.json(result);
  }

}));



// 가입 하기
router.post('/user/register/', co.wrap(function* (req, res){
  var {user_dt,user, user_auth} = req.body;

    // error처리 아직 안함!
  // if (!user  || !user_dt || !user_auth){
  //   return returnError( "not_enough_body", res )
  // }
    var results = JSON.stringify({
        status: 200,
        results:"success"
    });

  //DB연결
  const conn      = yield getConnection(res);

  if( conn.code ) return;


  //쿼리 생성
  const insertQuery      = 'INSERT into user SET ?';
  const insertQuery_auth  = 'INSERT into user_auth SET ?';
  const insertQuery_dt  = 'INSERT into user_dt SET ?';

  const salt      = get_random_string(SECRET_KEY_LENGTH);
  var password = String(user_auth.password);
  user_auth.password    = string_to_hash(password, salt);
  user_auth.salt  = salt;


  var insertId    = yield _query(conn, insertQuery, [user]);
  user_auth.no_user = insertId.insertId;
  user_dt.no_user = insertId.insertId;

  //user_auth, user_dt에 어떻게 넣으면 될까욤?
  var insert_auth = yield _query(conn, insertQuery_auth, [user_auth]);
  var insert_dt =  yield _query(conn, insertQuery_dt, [user_dt]);
  //

    var results_str = 'status: 200';



    // res.sendStatus(200);
    conn.release();
    return res.json(results);

  // if(insertId) return returnSuccess(insertId, res, conn );
  // else if(conn) conn.release();
}));




////////////////////////////////////////////////////
//    login
////////////////////////////////////////////////////
router.put('/user/auth/login/', co.wrap(function* (req, res) {

  const {user,user_auth}         = req.body;


  if( !user_auth ){
      var result = JSON.stringify({
          status: 0,
          results:"data empty!"
      });
      return res.json(result);
  }


  const selectUserAuthQuery = 'SELECT * FROM user_auth WHERE email = ?';
  const selectUserQuery     = 'SELECT * FROM user WHERE no_user = ? ';

  // const selectUserDtQuery   = 'SELECT * FROM user_dt WHERE no_user = ?';


  //DB연결
  const conn      = yield getConnection(res);

  if( conn.code ) {
    var result = JSON.stringify({
        status: 0,
        results:"server connection error"
    });
    return res.json(result);
  }

  var rows    = yield _query(conn, selectUserAuthQuery, [user_auth.email] );

  // if(!rows)   return returnError("cant_load_user", res, conn );


  var auth    = rows[0];

  var no_usr  = auth.no_user;

  var pw      = String(user_auth.password);

  // hash key를 private(password), public(salt) 두개를 매칭해서 값을 확인한다!
  if(!verify_hash( pw, auth.password, auth.salt )){
      var result = JSON.stringify({
          status: 200,
          results:"password is not correct"
      });
      return res.json(result);
  }

  // Q. Token 처리를 지금 한요? Salt는 무엇인지요?
  // const token = jwt.sign({
  //     id: auth.no_user,
  // }, auth.salt, {expiresIn: TOKEN_EXPIRY_TIME});

  // const q = yield _query(conn, updateUserAuthQuery, [token, usr_id]);

  const user_table        = yield _query(conn, selectUserQuery, [no_usr]);

  // if( !user || !userDt || !userPf) return returnError("cant_load_user", res, conn );

  const user_data = user_table[0];

  var results = JSON.stringify({
    status: 200,
    results: {
        status:"success",
        user:user_data
    }
  });

  conn.release();
  return res.json(results);

}));


//상세 조회, 안 쓰임
/*
router.get('/user/detail/:usr_id', co.wrap(function* (req, res) {

  var pst_id 							= req.params.usr_id;
  var selectUserQuery 		= 'SELECT * FROM user WHERE no_user = ? ';
  var selectUserDtQuery 	= 'SELECT * FROM user_dt WHERE no_user = ?';
  var selectUserPfQuery 	= 'SELECT * FROM user_pf WHERE no_user = ?';
  var selectUserAuthQuery = 'SELECT * FROM user_auth WHERE no_user = ?';

  const conn        = yield getConnection(res);
  if( conn.code ) return;


}));
*/
////////////////////////////////////////////////////
//    갱신
////////////////////////////////////////////////////
//  유저 갱신, 안 쓰임
/*
router.put('/user/update/:usr_id', co.wrap(function* (req, res) {

  const {user_pf} = req.body;
  if(!user_pf)       return returnError( 'not_enough_body', res );  

  console.log(user_pf);
  
  var pst_id              = req.params.usr_id;

  var updateUserPfQuery   = 'UPDATE user_pf SET ? WHERE no_user = ?';

  //DB연결
  const conn      = yield getConnection(res);
  if( conn.code ) return;

  if(user_pf){ 	
    if(yield _putQuery(res, conn, updateUserPfQuery, [user_pf, pst_id])) {}
    else return;
  }

  returnSuccess('성공', res, conn)
}));
*/

// upload profile
router.post('/profile/upload/', co.wrap(function* (req, res) {

    var {user} = req.body;
    user.no_user = parseInt(user.no_user);
    var updateUserUri   = 'UPDATE user SET user_uri = ? WHERE no_user = ?';

    //DB연결
    const conn      = yield getConnection(res);
    if( conn.code ) return;

    //쿼리 생성
    var insert_post = yield _query(conn, updateUserUri, [user.user_uri,user.no_user]);


    var results = JSON.stringify({
        status: 200,
        results: "success"
    });

    conn.release();
    return res.json(results);

}));


//upload 게시판!
router.post('/post/register/', co.wrap(function* (req, res) {

    var {post,tag,tag_item} = req.body;

    if (!post  || !tag || !tag_item){
      return;
    }

    const selectQuery_user      = 'SELECT user_uri FROM user WHERE no_user = ?';
    const insertQuery_post      = 'INSERT into post SET ?';
    const insertQuery_tag       = 'INSERT into tag SET ?';
    const selectQuery_tag       = 'SELECT * FROM tag WHERE tag = ?';
    const insertQuery_tagitem   = 'INSERT into tag_item SET ?';

    //DB연결
    const conn      = yield getConnection(res);
    if( conn.code ) return;

    var rows_useruri = yield _query(conn,selectQuery_user,[post.no_user]);

    if(rows_useruri[0]!=null){
        post.user_uri = rows_useruri[0].user_uri;
    }

    // 해쉬 태그 나눠서 분석!
    var hash_tag_array = String(post.hash_tag).split("#");
    var hash_tag_length =hash_tag_array.length;

    //쿼리 생성
    var insert_post = yield _query(conn, insertQuery_post, [post]);

    if(hash_tag_length>=2){
      for( var i =1;i<hash_tag_length;i++){
          var check = yield _query(conn,selectQuery_tag,[hash_tag_array[i]]);
          // default 0
          var no_tag = 0;

          if(check[0]==null){
              tag.tag = hash_tag_array[i];
              var re = yield _query(conn,insertQuery_tag,[tag]);
              no_tag =re.insertId;
          }else{
              no_tag = check[0].no_tag;
          }
          // insert into tag_item table
          tag_item.no_tag = no_tag;
          tag_item.no_pst = insert_post.insertId;

          yield _query(conn,insertQuery_tagitem,[tag_item]);
      }
    }
    var results = JSON.stringify({
        status: 200,
        results: "success"

    });

    conn.release();
    return res.json(results);

    // if(insert_post) return returnSuccess(insert_post, res, conn );
    // else if(conn) conn.release();

}));


// hashtag 구현
router.get('/tag/search/', co.wrap(function* (req, res){

    const { tag }       = req.query;

    // if( !no_user )          return returnError('not_enough_query',res);

    const selectQuery_tag      = 'SELECT * FROM tag WHERE tag LIKE ?';
    const selectQuery_tagitem  = 'SELECT COUNT(*) AS count FROM tag_item where no_tag = ?';
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_tag, ['%'+tag+'%']);

    var results = JSON.stringify({
        status: 200,
        results: {

        }
    });

    if(rows[0]!=null){
        for(var i=0;i<rows.length;i++){
            var rows2 = yield _query(conn,selectQuery_tagitem,rows[i].no_tag);
            rows[i].cnt = rows2[0].count;
        }
        var results2 = JSON.stringify(rows);
        conn.release();
        return res.json(results2);
    }


}));

// main page 데이터 반환!
router.get('/main/', co.wrap(function* (req, res){


    // if( !no_user )          return returnError('not_enough_query',res);

    const selectQuery_post      = 'SELECT * FROM post ORDER BY no_pst DESC';
    const selectQuery_user      = 'SELECT * FROM user WHERE no_user = ?';
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_post,[]);


    var results = JSON.stringify({
        status: 200,
        results: {

        }
    });

    if(rows[0]!=null){
        for(var i = 0; i<rows.length;i++){
            var temp = yield _query(conn,selectQuery_user,[rows[i].no_user]);
            if(temp[0]!=null){
                rows[i].nick_name = temp[0].nick_name;
                rows[i].user_uri = temp[0].user_uri;
            }
        }
        var results2 = JSON.stringify(rows);
        conn.release();
        return res.json(results2);
    }


}));

// cnt like
router.post('/main/like', co.wrap(function* (req, res){

    const {cnt_like,check} = req.body;
    cnt_like.no_user = parseInt(cnt_like.no_user);
    // if( !no_user )          return returnError('not_enough_query',res);

    const insertQuery_like      = 'INSERT into cnt_like SET ?';
    const deleteQuery_like      = 'DELETE FROM cnt_like WHERE no_pst = ? AND no_user = ?';


    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = '';
    var isLike = true;
    var rows_post ='';
    if(!check){
        rows = yield _query(conn, insertQuery_like,[cnt_like]);
        const updateQuery_post = 'UPDATE post SET cnt_like = cnt_like + 1 WHERE no_pst = ?';
        rows_post = yield _query(conn,updateQuery_post,[cnt_like.no_pst]);
    }else{
        rows = yield _query(conn, deleteQuery_like,[cnt_like.no_pst,cnt_like.no_user]);
        isLike = false;
        const updateQuery_post = 'UPDATE post SET cnt_like = cnt_like - 1 WHERE no_pst = ?';
        rows_post = yield _query(conn,updateQuery_post,[cnt_like.no_pst]);
    }

    var results = JSON.stringify({
        status: 200,
        results:isLike
    });

        conn.release();
        return res.json(results);

}));

router.post('/main/checklike', co.wrap(function* (req, res){

    const {cnt_like} = req.body;
    console.log("main/checklike--------------------")
    console.log(cnt_like);
    cnt_like.no_user = parseInt(cnt_like.no_user);
    // if( !no_user )          return returnError('not_enough_query',res);

    const selectQuery_like      = 'SELECT * FROM cnt_like WHERE no_pst = ? AND no_user = ?';

    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_like,[cnt_like.no_pst,cnt_like.no_user]);
    console.log(rows);
    if(rows[0]!=null){
        var results = JSON.stringify({
            status: 200,
            results: true
        });
        conn.release();
        return res.json(results);
    }else{
        var results = JSON.stringify({
            status: 200,
            results: false
        });
        conn.release();
        return res.json(results);
    }




}));

// like page 데이터 반환!
router.post('/like/', co.wrap(function* (req, res){

    var {no_user} = req.body;
    console.log(no_user);
    // if( !no_user )          return returnError('not_enough_query',res);
    no_user = parseInt(no_user);

    const selectQuery_cnt_like  = 'SELECT no_pst FROM cnt_like WHERE no_user = ?';
    const selectQuery_post      = 'SELECT * FROM post WHERE no_pst = ?';
    const selectQuery_user      = 'SELECT * FROM user WHERE no_user = ?';
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_cnt_like,[no_user]);

    if(rows[0]!=null){
         for(var i=0;i<rows.length;i++){
             var rows2 = yield _query(conn, selectQuery_post,[rows[i].no_pst]);
             var rows3 = yield _query(conn,selectQuery_user,[rows2[0].no_user]);
             if(rows3[0]!=null){
                 rows2[0].nick_name = rows3[0].nick_name;
                 rows2[0].user_uri = rows3[0].user_uri;
             }
             rows[i] = rows2[0];
        }
        var results2 = JSON.stringify(rows.reverse());
        conn.release();
        return res.json(results2);
    }else{
        var results = JSON.stringify({
            status: 200,
            results:null
        });
        conn.release();
        return res.json(results);
    }
}));

// tag page 데이터 반환!
router.post('/hashtag/', co.wrap(function* (req, res){

    var {tag} = req.body;
    console.log(tag);
    // if( !no_user )          return returnError('not_enough_query',res);

    const selectQuery_tag       = 'SELECT no_tag FROM tag WHERE tag = ?';
    const selectQuery_tag_item      = 'SELECT no_pst FROM tag_item WHERE no_tag = ?';
    const selectQuery_post      = 'SELECT * FROM post WHERE no_pst = ?';
    const selectQuery_user      = 'SELECT * FROM user WHERE no_user = ?';
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_tag,[tag]);

    if(rows[0]!=null){
        var rows2 = yield _query(conn, selectQuery_tag_item,[rows[0].no_tag]);
        for(var i=0;i<rows2.length;i++){
            var rows3 = yield _query(conn,selectQuery_post,[rows2[i].no_pst]);
            var rows4 = yield _query(conn,selectQuery_user,[rows3[0].no_user]);
            rows3[0].nick_name = rows4[0].nick_name;
            rows3[0].user_uri = rows4[0].user_uri;
            rows2[i] = rows3[0];
        }

        var results2 = JSON.stringify(rows2.reverse());
        conn.release();
        return res.json(results2);
    }else{
        var results = JSON.stringify({
            status: 200,
            results:null
        });
        conn.release();
        return res.json(results);
    }
}));



router.post('/comment/register/', co.wrap(function* (req, res) {

    const {post_cmt} = req.body;
    post_cmt.no_user = parseInt(post_cmt.no_user);

    // if(!post_cmt)       return returnError( 'not_enough_body', res );


    var insertQuery_post_cmt     = 'INSERT into post_cmt SET ?';
    var selectQuery_user         = 'SELECT user_uri FROM user WHERE no_user = ?';
    //DB연결
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_user,[post_cmt.no_user]);
    console.log(rows);
    if(rows[0]!=null){
        post_cmt.user_uri = rows[0].user_uri;
        var rows2 = yield _query(conn,insertQuery_post_cmt,[post_cmt])
        var results = JSON.stringify({
            status: 200,
            results: true
        });
        conn.release();
        return res.json(results);
    }else{
        var results = JSON.stringify({
            status: 200,
            results: false
        });
        conn.release();
        return res.json(results);
    }
}));

router.post('/comment/list/', co.wrap(function* (req, res) {

    const {no_pst} = req.body;

    // if(!post_cmt)       return returnError( 'not_enough_body', res );

    var selectQuery_post_cmt     = 'SELECT * FROM post_cmt WHERE no_pst = ?';
    var selectQuery_user         = 'SELECT * FROM user WHERE no_user = ?'
    //DB연결
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_post_cmt,[no_pst]);

    if(rows[0]!=null){
        for(var i=0;i<rows.length;i++){
            var rows2 = yield _query(conn,selectQuery_user,[rows[i].no_user]);
            rows[i].nick_name = rows2[0].nick_name;
            rows[i].user_uri  = rows2[0].user_uri;
        }
        var results = JSON.stringify({
            status: 200,
            results: rows
        });
        conn.release();
        return res.json(results);
    }else{
        var results = JSON.stringify({
            status: 200,
            results: false
        });
        conn.release();
        return res.json(results);
    }
}));

router.post('/reply/register/', co.wrap(function* (req, res) {

    const {post_rep} = req.body;
    post_rep.no_pst = parseInt(post_rep.no_pst);
    post_rep.no_user = parseInt(post_rep.no_user);
    // if(!post_cmt)       return returnError( 'not_enough_body', res );

    var selectQuery_user         = 'SELECT * FROM user WHERE no_user = ?'
    var insertQuery_post_rep     = 'INSERT into post_rep SET ?';
    var selectQuery_post_rep     = 'SELECT * FROM post_rep WHERE no_pst_rep = ?'

    //DB연결
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_user,[post_rep.no_user]);
    if(rows[0]!=null){
        post_rep.user_uri = rows[0].user_uri;
        var nick_name = rows[0].nick_name;
        var rows2 = yield _query(conn,insertQuery_post_rep,[post_rep])
        if(rows[0]!=null){
            var rows3 = yield _query(conn,selectQuery_post_rep,[rows2.insertId])
            rows3[0].nick_name = nick_name;
            var results = JSON.stringify({
                status: 200,
                results: rows3
            });
            conn.release();
            return res.json(results);
        }
    }else{
        var results = JSON.stringify({
            status: 200,
            results: false
        });
        conn.release();
        return res.json(results);
    }
}));

router.post('/reply/list/', co.wrap(function* (req, res) {

    const {no_pst_cmt} = req.body;

    // if(!post_cmt)       return returnError( 'not_enough_body', res );

    var selectQuery_post_reply     = 'SELECT * FROM post_rep WHERE no_pst_cmt = ?';
    var selectQuery_user           = 'SELECT * FROM user WHERE no_user = ?';
    //DB연결
    const conn      = yield getConnection(res);

    if( conn.code ) return;

    var rows = yield _query(conn, selectQuery_post_reply,[no_pst_cmt]);

    if(rows[0]!=null){
        for(var i=0;i<rows.length;i++){
        var rows2 = yield _query(conn,selectQuery_user,[rows[i].no_user]);
        rows[i].nick_name = rows2[0].nick_name;
        rows[i].user_uri = rows2[0].user_uri;
    }
        var results = JSON.stringify({
            status: 200,
            results: rows
        });
        conn.release();
        return res.json(results);
    }else{
        var results = JSON.stringify({
            status: 200,
            results: false
        });
        conn.release();
        return res.json(results);
    }
}));

module.exports = router;



























