const express = require('express')
const path = require('path');
const request = require('request');
const app = express();
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth');

//json 타입의 데이터 전송을 허용
app.use(express.json());
//form 타입의 데이터 전송을 허용
app.use(express.urlencoded({ extended: false }));
// express 위치 공개
app.use(express.static(path.join(__dirname, 'public')));//to use static asset


app.set('views', __dirname + '/views');
//뷰파일이 있는 디렉토리 설정
app.set('view engine', 'ejs');
//뷰 엔진으로 ejs 사용

app.get('/', function (req, res) {
  res.send('Hello World')
})

/*랜더링 하는 라우터들 */
app.get('/signup', function (req, res) {
  res.render('signup'); //view에 있는 html .ejs 파일들 연결
})

app.get('/login',function(req,res){
  res.render('login'); //jwt 전송(json web token), access token이 jwt 방식으로 만들어져있다
})

app.get('/main',function(req,res){
  res.render('main');
})

app.get('/balance', function(req, res){
  res.render('balance');
})

app.get('/qrcode', function(req, res){
  res.render('qrcode'); //fintech use number를 가져와서 QR 코드 생성
})

app.get('/qrreader', function(req, res){
  res.render('qrreader'); //fintech use number를 가져와서 QR 코드 생성
})

app.get('/authTest', auth ,function(req,res){
  res.send("정상적으로 로그인 하셨다면 해당 화면이 보입니다.")
})

app.get('/authResult',function(req,res){
  var authCode = req.query.code; //주소에 붙어있던 코드 값 가져오는 변수
  var option = {
    method : "POST",
    url : "https://testapi.openbanking.or.kr/oauth/2.0/token",
    header : {
        'Content-Type' : 'application/x-www-form-urlencoded'
    },
    form : {
      code: authCode,
      client_id: "56936d79-8f12-42a1-b05f-bd93499c5646",
      client_secret: "68cc6434-ac88-4035-990a-a3b8d0201904",
      redirect_uri: "http://localhost:3000/authResult",
      grant_type: "authorization_code"
    }
  }

  request(option, function(err, response, body){
    if(err){
        console.error(err);
        throw err;
    }
    else {
        var accessRequestResult = JSON.parse(body);
        //console.log(accessRequestResult);
        res.render('resultChild', {data : accessRequestResult});
    }
  })
})

app.post('/signup',function(req,res){
  //사용자한테 데이터를 받아서 db에 저장하는 부분
  var userName = req.body.userName;
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  var userAccessToken =  req.body.userAccessToken;
  var userRefreshToken = req.body.userRefreshToken;
  var userSeqNo = req.body.userSeqNo;
  //(userName, userEmail, userPassword); //아래 물음표 동적 할당
  var sql = "INSERT INTO user (name, email, password, accessToken, refreshToken, userseqno) VALUES (?,?,?,?,?,?)"
  connection.query(sql,[userName,userEmail, userPassword,userAccessToken,userRefreshToken,userSeqNo], function (err, results) {
    if(err){
      console.error(err);
      throw err;
    }
    else{
      res.json(1);
    }
  });
})

app.post('/login', function(req, res){
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  //console.log(userEmail, userPassword)
  var sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [userEmail], function(err, result){
    if(err){
        console.error(err);
        res.json(0);
        throw err;
    }
    else {
      if(result.length == 0){
        res.json(3)
      }
      else {
        var dbPassword = result[0].password;
        if(dbPassword == userPassword){
          var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
          jwt.sign(
            {
              userId : result[0].id,
              userEmail : result[0].email
            },
            tokenKey,
            {
              expiresIn : '10d',
              issuer : 'fintech.admin',
              subject : 'user.login.info'
            },
            function(err, token){
              //console.log('로그인 성공')
              res.json(token)
            }
          )            
        }
        else {
          res.json(2);
        }
      }
    }
  })
})

app.post('/list', auth, function(req, res) { //사용자 확인을 위해 미들웨어 auth 사용
  var user = req.decoded;
  //console.log(user);
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql,[user.userId], function(err, result){
    if(err) throw err;
    else {
      var dbUserData = result[0];
      //console.log(dbUserData);
      var option = {
        method : "GET",
        url : "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers : {
          Authorization : "Bearer " + dbUserData.accessToken
        },
        qs : {
          user_seq_no : dbUserData.userseqno
        }
      }
      request(option, function(err, response, body) {
        if(err){
          console.error(err);
          throw err;
        }
        else {
          var listRequestResult = JSON.parse(body);
          //console.log(listRequestResult);
          res.json(listRequestResult)
        }
      })
    }
  })
})

/*---- 사용자 정보 조회, 사용자 정보를 바탕으로 request 요청 작성 (잔액 조회 api 사용) ----*/
app.post('/balance',auth, function(req, res){
  var user = req.decoded;
  var finusenum = req.body.fin_use_num
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  //(countnum);
  var transId = "M202111596U" + countnum;
  var sql = "SELECT * FROM user WHERE id = ?"
  connection.query(sql,[user.userId], function (err, results) {
    //console.log(results[0].accessToken);
    if(err) throw err;
    else{
      var option = {
        method : "GET",
        url : "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
        headers : {
          Authorization : "Bearer " + results[0].accessToken
        },
        qs : {
          bank_tran_id : transId,
          fintech_use_num : finusenum,
          tran_dtime : "20210225132400"
        }
      };
      request(option, function (err, response, body) {
        if(err){
          console.error(err);
          throw err;
        }
        else{
          var balanceRquestResult = JSON.parse(body);
          res.json(balanceRquestResult);
        }
      });
    }
  });
})

/*---- 사용자 정보 조회, 사용자 정보를 바탕으로 request 요청 작성 (거래 내역 조회 api 사용) ----*/
app.post('/transactionlist', auth, function (req, res){
  var user = req.decoded;
  var finusenum = req.body.fin_use_num
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "M202111596U" + countnum;
  var sql = "SELECT * FROM user WHERE id = ?"

  connection.query(sql,[user.userId], function (err, results){
    if(err) throw err;
    else{
      var option = {
        mothod : "GET",
        url : " https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
        headers : {
          Authorization : "Bearer " + results[0].accessToken
        },
        qs : {
          bank_tran_id : transId,
          fintech_use_num : finusenum,
          inquiry_type : "A",
          inquiry_base : "D",
          from_date : "20160405",
          to_date : "20210225",
          sort_order : "D",
          tran_dtime : "20210225132400"
        }
      }
      request(option, function (err, response, body) {
        if(err){
          console.error(err);
          throw err;
        }
        else{
          var transactionlistResult = JSON.parse(body);
          res.json(transactionlistResult);
        }
      });
    }
  })

})

/*--- 이체 ---*/
app.post('/withdraw', auth, function(req, res){
  //사용자 출금이체 API 수행하기
  //console.log(req.body);
  var user = req.decoded;
  var sql = "SELECT * FROM user WHERE id = ?";
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "M202111596U" + countnum;  

  connection.query(sql,[user.userId], function(err, result){
    if(err) throw err;
    else {
      var dbUserData = result[0];
      //console.log(dbUserData);
      var option = {
        method : "POST",
        url : "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
        headers : {
          Authorization : "Bearer " + dbUserData.accessToken
        },
        json : {
          "bank_tran_id" : transId,
          "cntr_account_type" : "N",
          "cntr_account_num" : "100000000001",
          "dps_print_content": "쇼핑몰환불",
          "fintech_use_num": req.body.fin_use_num,
          "wd_print_content": "오픈뱅킹출금",
          "tran_amt": req.body.amount,
          "tran_dtime": "20210225132400",
          "req_client_name": "홍길동",
          "req_client_fintech_use_num" : req.body.fin_use_num,
          "req_client_num": "HONGGILDONG1234",
          "transfer_purpose": "ST",
          "recv_client_name": "홍길동",
          "recv_client_bank_code": "097",
          "recv_client_account_num": "100000000001"
        }
      }
      request(option, function(err, response, body){
        if(err){
          console.error(err);
          throw err;
        }
        else {
          var transactionListResuult = body;
          if(transactionListResuult.rsp_code === "A0000"){
            var countnum2 = Math.floor(Math.random() * 1000000000) + 1;
            var transId2 = "M202111596U" + countnum2;                     
            var option = {
              method : "POST",
              url : "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
              headers : {
                Authorization : "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJNMjAyMTExNTk2Iiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNjIyMDg4Mjg2LCJqdGkiOiIwYzAxMzc0OS1kNzAzLTRkZjQtOTVmYS0yYTkwM2IzOTdiZDcifQ.-_sPTA7WssOewnpQfY59j7OS5QAOik9gx3LlaPQujRw"
              },
              //get 요청을 보낼때 데이터는 qs, post 에 form, json 입력가능
              json : {
                "cntr_account_type": "N",
                "cntr_account_num": "200000000001",
                "wd_pass_phrase": "NONE",
                "wd_print_content": "환불금액",
                "name_check_option": "off",
                "tran_dtime": "20210225132400",
                "req_cnt": "1",
                "req_list": [{
                  "tran_no": "1",
                  "bank_tran_id": transId2,
                  "fintech_use_num": req.body.to_fin_use_num,
                  "print_content": "쇼핑몰환불",
                  "tran_amt": req.body.amount,
                  "req_client_name": "홍길동",
                  "req_client_num": "HONGGILDONG1234",
                  "req_client_fintech_use_num": req.body.fin_use_num,
                  "transfer_purpose": "ST"
                }]
              }
            }
            request(option, function (error, response, body) {
              console.log(body);
              res.json(body);
            });
              
          }
        //입금 api 실행 A0000 res_code 입급이체 발생
        }
      })        
    }
  })
})


// DB연동
var mysql      = require('mysql');
const { get } = require('request');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '55555',
  database : 'fintech'
});
connection.connect();

app.listen(3000)