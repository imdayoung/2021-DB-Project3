const { request, application } = require('express');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

// session
router.use(session({
  secret: '!@#$%',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))

// MYSQL loading
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: 'dayoungqlqjs123!',
  database: 'vaccine_reservation',
  multipleStatements: true,
  dateStrings: 'date'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/vaccine/main');
});

// 메인 페이지
router.get('/main', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var sqlForCount = "SELECT COUNT(*) AS ICOUNT FROM `INOCULATION` WHERE `idate`=DATE(now());";
    connection.query(sqlForCount, function(err, rows0) {
      if(err) console.error("err: " + err);
      var sqlForCount = "SELECT COUNT(*) AS DCOUNT FROM `DIAGNOSIS` WHERE `date`=DATE(now());";
      connection.query(sqlForCount, function(err, rows1) {
        if(err) console.error("err: " + err);
        if(req.session.is_logined == true){
          res.render('main', { title: '메인 페이지', rows0:rows0[0], rows1:rows1[0], is_logined:req.session.is_logined });
          connection.release();
        }
        else{
          res.render('main', { title: '메인 페이지', rows0:rows0[0], rows1:rows1[0], is_logined:false });
          connection.release();
        }
      });
    });
  });
});

// 로그인 페이지
router.get('/login', function(req, res, next) {
  res.render('login', { title: '로그인 페이지' });
});

router.post('/login', function(req, res, next) {
  var id = req.body.id;
  var passwd = req.body.passwd;
  var datas = [id, passwd];

  pool.getConnection(function(err, connection){
    var sqlForLogin = "SELECT * FROM `MEMBER` WHERE id=? AND pwd=?";
    connection.query(sqlForLogin, datas, function(err, rows) {
      if(err) console.error("err: " + err);
      if(rows.length > 0){
        req.session.is_logined = true;
        req.session.useridx = rows[0].mindex;
        req.session.username = rows[0].mname;
        req.session.userid = rows[0].id;
        req.session.userrrn = rows[0].rrn;
        req.session.userphone = rows[0].mphone;
        req.session.usersex = rows[0].sex;
        req.session.userage = rows[0].mage;
        req.session.useraddress = rows[0].maddress;
        req.session.userpwd = rows[0].pwd;

        pool.getConnection(function(err, connection) {
          var sqlForCount = "SELECT COUNT(*) AS ICOUNT FROM `INOCULATION` WHERE `idate`=DATE(now());";
          connection.query(sqlForCount, function(err, rows0) {
            if(err) console.error("err: " + err);
            var sqlForCount = "SELECT COUNT(*) AS DCOUNT FROM `DIAGNOSIS` WHERE `date`=DATE(now());";
            connection.query(sqlForCount, function(err, rows1) {
              if(err) console.error("err: " + err);
              req.session.save(function(){
                res.render('main', { title:'회원가입 페이지', is_logined:true, rows0:rows0[0], rows1:rows1[0] });
              })
              connection.release();
            });
          });
        });
      }
      else{
        res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/vaccine/login";</script>');
        connection.release();
      };
    });
  });
});

// 로그아웃
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    res.redirect('/vaccine');
  });
});

// 회원가입 페이지
router.get('/join', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var sqlForCheckID = "SELECT id FROM `MEMBER`";
    connection.query(sqlForCheckID, function(err, rows0) {
      if(err) console.error("err: " + err);
      var sqlForCheckRRN = "SELECT rrn FROM `MEMBER`";
      connection.query(sqlForCheckRRN, function(err, rows1) {
        if(err) console.error("err: " + err);
        res.render('join', { title: '회원가입 페이지' , rows0:rows0, rows1:rows1 });
        connection.release();
      });
    });
  });
});

router.post('/join', function(req, res, next) {
  var name = req.body.name;
  var rrn = req.body.rrn;
  var id = req.body.id;
  var passwd = req.body.passwd;
  var tel = req.body.tel;
  var address = req.body.address;
  var datas = [name, rrn, id, passwd, tel, address];

  pool.getConnection(function(err, connection) {
    var sqlForRrnDup = "SELECT * FROM `MEMBER` WHERE rrn=?";
    
    connection.query(sqlForRrnDup, rrn, function(err, rows) {
      if(err) console.error("err: " + err);
      if(rows.length > 0) {
        res.send('<script type="text/javascript">alert("이미 가입된 회원입니다."); document.location.href="/vaccine/join";</script>');
        connection.release;
      }
      else {
        var sqlForIdDup = "SELECT * FROM `MEMBER` WHERE id=?";
        connection.query(sqlForIdDup, id, function(err, rows) {
          if(err) console.error("err: " + err);
          if(rows.length > 0) {
            res.send('<script type="text/javascript">alert("중복된 아이디입니다."); document.location.href="/vaccine/join";</script>');
            connection.release;
          }
          else {
            var sqlForJoin = "INSERT INTO `MEMBER`(mname,rrn,id,pwd,mphone,maddress) values(?,?,?,?,?,?);";
            sqlForJoin += "UPDATE `MEMBER` SET sex = CASE WHEN rrn LIKE'%-1%' OR rrn LIKE '%-3%' THEN 'M' ELSE 'F' END;";
            sqlForJoin += "UPDATE `MEMBER` SET mage = (2021-cast((left(`rrn`,2)) as unsigned)) % 100;";
        
            connection.query(sqlForJoin, datas, function(err, rows) {
              if(err) console.error("err: " + err);
              res.redirect('/vaccine/joinsuccess');
              connection.release();
            });
          }
        })
      }
    })
  });
});

// 회원가입 성공 페이지
router.get('/joinsuccess', function(req, res, next) {
  res.render('joinsuccess', { title: '회원가입 성공 페이지' });
});

// 내 정보 페이지
router.get('/myinfo', function(req, res, next) {
  var mindex = req.session.useridx;
  
  pool.getConnection(function(err, connection) {
    var sqlForReserv = "SELECT R.rdate, R.rtime, R.hindex, R.vname FROM `RESERVATION` R WHERE R.mindex = ?;";
    connection.query(sqlForReserv, [mindex], function(err, rows0) {
      if(err) console.error("err: " + err);
      var sqlForInoc = "SELECT I.idate, I.hindex, I.vname, I.inum FROM `INOCULATION` I WHERE I.mindex = ? AND I.vname=SOME(SELECT vname FROM `VACCINE`);";
      connection.query(sqlForInoc, [mindex], function(err, rows1) {
        if(err) console.error("err: " + err);
        if(rows0.length == 0){
          var sqlForFindHsptl = "SELECT hname FROM `HOSPITAL` WHERE hindex=?";
          connection.query(sqlForFindHsptl, 1, function(err, rows2) {
            res.render('myinfo', { title: '내 정보 페이지', rows0:rows0, rows1:rows1, rows2:rows2, useridx:req.session.useridx, username:req.session.username, userid:req.session.userid, userrrn:req.session.userrrn, userphone:req.session.userphone, usersex:req.session.usersex, userage:req.session.userage, useraddress:req.session.useraddress });
            connection.release();
          })
        }
        else{
          var sqlForFindHsptl = "SELECT hname FROM `HOSPITAL` WHERE hindex=?";
          connection.query(sqlForFindHsptl, rows0[0].hindex, function(err, rows2) {
            res.render('myinfo', { title: '내 정보 페이지', rows0:rows0, rows1:rows1, rows2:rows2, useridx:req.session.useridx, username:req.session.username, userid:req.session.userid, userrrn:req.session.userrrn, userphone:req.session.userphone, usersex:req.session.usersex, userage:req.session.userage, useraddress:req.session.useraddress });
            connection.release();
          })
        }
        
       
      });
    });
  });
});

router.post('/myinfo', function(req, res, next) {
  var mindex = req.session.useridx;

  pool.getConnection(function(err, connection) {
    var sqlForCancel = "DELETE FROM `RESERVATION` WHERE mindex = ?";
    connection.query(sqlForCancel, [mindex], function(err, rows) {
      if(err) console.error("err: " + err);
      res.redirect('myinfo');
      connection.release();
    })
  });
});

// 예약 변경 페이지
router.get('/changersv', function(req, res, next) {
  var mindex = req.session.useridx;
  
  pool.getConnection(function(err, connection) {
    var sqlForReserv = "SELECT R.rdate, R.rtime, R.hindex, R.vname FROM `RESERVATION` R WHERE R.mindex = ?;";
    connection.query(sqlForReserv, [mindex], function(err, rows0) {
      if(err) console.error("err: " + err);
      var sqlForInoc = "SELECT I.idate, I.hindex, I.vname FROM `INOCULATION` I WHERE I.mindex = ? AND I.vname=SOME(SELECT vname FROM `VACCINE`);";
      connection.query(sqlForInoc, [mindex], function(err, rows1) {
        if(err) console.error("err: " + err);
        var sqlForFindHsptl = "SELECT hname FROM `HOSPITAL` WHERE hindex=?";
        connection.query(sqlForFindHsptl, rows0[0].hindex, function(err, rows2) {
          res.render('changersv', { title: '예약 변경 전 페이지', rows0:rows0, rows1:rows1, rows2:rows2, useridx:req.session.useridx, username:req.session.username, userid:req.session.userid, userrrn:req.session.userrrn, userphone:req.session.userphone, usersex:req.session.usersex, userage:req.session.userage, useraddress:req.session.useraddress });
          connection.release();
        })
      });
    });
  });
});

module.exports = router;
