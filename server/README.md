## Insta_intern

### Server

### Project 진행

1. > npm install

2. Mysql workbench 연결 후 , Table 생성

3. chrome의 개발자 도구 "Postman" 으로 backend 작업. front 하지 않고도 자체적으로 request 보내서 작업 가능

4. 로그인, 회원가입, 게시판 올리기, 해시태그 저장 구현 (client와 연동 하지 않음)

5. ​



















### Project analysis

- ```js
  // ES6 destructing assingment, req.query안에 id 변수 값만 받는 것!! 없으면 undefiend 겠지?!
  const {id} = req.query
  ```

- ```js
  // base.js
  conn.query(query,param,(err,rows)=>{
    //여기서 rows는 object type 으로 되 있으니 JSON.stringify로 변환 시켜주면 JSON 객체로 데이터를 받아온다! length 로 갯수 확인해서 하면 되겠지요?!
  })
  ```

- 비밀번호 암호화 및 로그인 방법 : password 를 hash key 로 변환해서 저장하는데 이때 salt 값도 같이 변환해서 넣어준다 (salt=SECRET_KEY_LENGTH). password는 private key, salt는 public key로 써 두 값을 비교해서 비밀번호를 확인해줄 수 있다!!!

  ```js
  // password, salt 해쉬 해서 저장!
  string_to_hash(password,salt);

  // password hash 풀어서 비밀번호 확인!
  verify_hash( password, auth.password, auth.salt )
  ```

- JWT 기반 회원인증 시스템 구현 [참고](https://velopert.com/2448) : 토큰을 기반으로 회원인증 시스템 구축, API 모델을 가진 어플리케이션에 적합.

  ```js
  import jwt from 'jsonwebtoken';
  ...
  const token = jwt.sign({
        id: auth.no_user,
    }, auth.salt, {expiresIn: TOKEN_EXPIRY_TIME});

  ```

  - **jwt.sign(payload, secret, options,[callback])** 

- nodejs 동기화 할 때 **yield** 명령어 써서 하면 해결됨! [참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/yield)

  ```js
  var check = yield _query(conn,selectQuery_tag,[hash_tag_array[i]]);
  if(check[0]==null){
    ...
  }
  ```

