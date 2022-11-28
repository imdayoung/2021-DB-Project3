const express = require('express');
const app = express();
const PORT = 8080;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require('axios');
const { application } = require('express');

/*SQL*/
var pool = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'dayoungqlqjs123!',
	database: 'vaccine_reservation',
	timezone: 'KST'
});
pool.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Server Response Success');
})

/*로그인*/
app.post('/login', function(req, res, next) {
  var data = [req.body.id, req.body.pw];
	console.log(data);
	var sqlLogin = "SELECT * FROM `MEMBER` WHERE id=? AND pwd=?";

	pool.query(sqlLogin, data, function(err, rows){
		if(err) console.log("로그인 실패");
		else{
			if(rows.length > 0){
				console.log(rows[0]);
				res.send(true);
			}
			else {
				console.log("로그인 정보 없음");
				res.send(false);
			}
		}
	})
})

/*회원가입*/
app.post('/checkId', function(req,res){
	let id = req.body.id;
	var sql = "SELECT * FROM `MEMBER` WHERE id=?";
	pool.query(sql, id, function(err, row) {
		if(err) console.log("아이디 체크 에러");
		if(row.length > 0){
			console.log(row);
			res.send(true); //아이디 중복
		} 
		else res.send(false);
	})
})
app.post('/join', function(req,res) {
	var name = req.body.name;
  var rrn = req.body.rrn;
	var id = req.body.id;
	var passwd = req.body.passwd;
	var tel = req.body.tel;
	var address = req.body.address;
	var datas = [name, rrn, id, passwd, tel, address];

	var sqlForRrnDup = "SELECT * FROM `MEMBER` WHERE rrn=?";   
  pool.query(sqlForRrnDup, rrn, function(err, rows) {
    if(err) console.log("회원가입 중복 유저 에러");
    if(rows.length > 0) {
      res.send(false);
    }
    else {
			var sqlForJoin = "INSERT INTO `MEMBER`(mname,rrn,id,pwd,mphone,maddress) values(?,?,?,?,?,?);";	
			console.log(datas);
      pool.query(sqlForJoin, datas, function(err, rows) {
        if(err) console.log("회원가입 에러1");
        else {
					sqlForJoin = "UPDATE `MEMBER` SET sex = CASE WHEN rrn LIKE'%-1%' OR rrn LIKE '%-3%' THEN 'M' ELSE 'F' END WHERE rrn=?;";
					pool.query(sqlForJoin, rrn ,function(err, rows) {
						if(err) console.log("회원가입 에러2");
						else {
							sqlForJoin = "UPDATE `MEMBER` SET mage = (2021-cast((left(`rrn`,2)) as unsigned)) % 100;";
							pool.query(sqlForJoin, rrn, function(err, rows) {
								if(err) console.log("회원가입 에러3");
								else {
									res.send(true)
								}
							});
						}
					});
				}
      });
		}
	})
})

/*내정보*/
app.post('/myInfo', function(req, res) {
	let id = req.body.id;
	var sqlForPersonal = "SELECT * FROM `MEMBER` WHERE id=?";
	pool.query(sqlForPersonal, id, function(err,row){
		if(err) console.log("내정보 에러");
		else{
			res.send(row[0]);
		}
	})
})
app.post('/myRsvInfo', function(req, res) {
	let id = req.body.id;

	var sqlMindex = "SELECT * FROM `MEMBER` WHERE id=?";
	var sqlRsv = "SELECT R.rdate, R.rtime, H.hname, vname FROM `RESERVATION` AS R, `HOSPITAL` AS H WHERE H.hindex = R.hindex and mindex = ?;"
	pool.query(sqlMindex, id, function(err,row){
		if(err) console.log("내 예약 이름 정보 에러");
		else{
			var mindex = row[0].mindex;
			pool.query(sqlRsv, mindex, function(err,row1){
			if(err) console.log("내 예약 정보 에러");
			else{
				console.log(row1);
				if(row1.length == 0){
					res.send(false);
				}
				else{
					res.send(row1);
				}
			}
		})
		}
	})
})
app.post('/myInoInfo', function(req, res){
	let id = req.body.id;
	var sqlIno = "SELECT I.idate, H.hname, I.vname, I.inum FROM `INOCULATION` AS I, `HOSPITAL` AS H, `MEMBER` AS M WHERE H.hindex = I.hindex and M.mindex = I.mindex and M.id = ?";
	pool.query(sqlIno, id, function(err,row){
		if(err) console.log("내정보 에러");
		else{
			if(row.length === 0){
				res.send(false)
			}
			else {
				console.log(row[0]);
				res.send(row[0]);
			}
		}
	})
})


/*메인*/
app.post('/main/inoculation', (req, res) => {
	let inoculation = req.body.inoculation;
	let sqlInoculation = "SELECT COUNT(*) AS ICOUNT FROM `INOCULATION` WHERE `idate`=DATE(now());";

	pool.query(sqlInoculation, inoculation, function(err, row){
		if(err) console.log("접종자 불러오기 실패");
		else{
			console.log("접종자 불러오기 성공");
			res.send(row[0]);
		}
	})
})
app.post('/main/diagnosis', (req, res) => {
	let diagnosis = req.body.diagnosis;
	let sqlDiagnosis = "SELECT COUNT(*) AS DCOUNT FROM `DIAGNOSIS` WHERE `date`=DATE(now());";

	pool.query(sqlDiagnosis, diagnosis, function(err, row){
		if(err) console.log("확진자 불러오기 실패");
		else{
			console.log("확진자 불러오기 성공");
			res.send(row[0]);
		}
	})
})


/*병원 리스트*/
app.post("/getList", (req,res) => {
	let inputArea = req.body.inputArea;
	let inputName = req.body.inputName;

	console.log(inputArea);
	console.log(inputName);

	let sql; 
	let value;

	if(inputArea != "" & (inputName != "" & inputName != undefined)){
		sql = "SELECT * from hospital WHERE SUBSTRING_INDEX(haddress, \" \", 1) = ? and hname LIKE ?";
		value = [inputArea, '%'+inputName+'%'];
	} 
	else if (inputArea == "" & (inputName != "" & inputName != undefined)) {
		sql = "SELECT * from hospital WHERE hname LIKE ?";
		value = '%'+inputName+'%';
	}
	else if (inputArea != "" & (inputName == "" | inputName == undefined)) {
		sql = "SELECT * from hospital WHERE SUBSTRING_INDEX(haddress, \" \", 1) = ?";
		value = inputArea;
	}
	else{
		sql = "SELECT * from hospital";
		pool.query(sql, function(err, row){
			if(err) console.log("불러오기 실패");
			else{
				console.log("불러오기 성공");
				res.send(row);
			}
		})
		return 0;
	}

	pool.query(sql, value, function(err, row){
		if(err) console.log("불러오기 실패");
		else{
			console.log("불러오기 성공");
			res.send(row);
		}
	})
});

/*예약*/
app.post('/reservation', (req, res) => {
	var id = req.body.loginId;
	var vname = req.body.vname;
	var vinterval = 0;
	var mindex = 0;

	var sqlMindex = "SELECT * FROM `MEMBER` WHERE id=?";
	var sqlVinterval = "SELECT * FROM VACCINE WHERE vname=?"
	var sqlReserve = "INSERT INTO RESERVATION(mindex, vname, hindex, rdate, rtime) VALUES(?,?,?,?,?);";

	/*mindex 구하기*/
	pool.query(sqlMindex, id, function(err, row){
		if(err) console.log("mindex 불러오기 실패");
		else {
			mindex = row[0].mindex;
			/*vinterval 구하기*/
			pool.query(sqlVinterval, vname, function(err, row){
				if(err) console.log("vinterval 불러오기 실패");
				else {
					vinterval = row[0].vinterval;
					console.log(vinterval);
					/*1차 예약 하기*/
					var data = [mindex, vname, req.body.hindex, req.body.selectedDate, req.body.selectedTime]
					console.log(data);
					pool.query(sqlReserve, data, function(err, row){
						if(err) console.log("1차 예약 실패");
						else {
							console.log("1차 예약 성공");
							if(vname === '얀센'){
								console.log("얀센은 2차가 없어요!");
								res.send(true);
							}
							else{
								var rsvDate2 = new Date(req.body.selectedDate);
								rsvDate2.setDate(rsvDate2.getDate()+vinterval);
								data = [mindex, vname, req.body.hindex, dateInMyFormat(rsvDate2), req.body.selectedTime]
								console.log(data);
								pool.query(sqlReserve, data, function(err, row){
									if(err) console.log("2차 예약 실패");
									else {
										console.log("2차 예약 성공");
										res.send(true);
									}
								})
							}
							
						}
					})
				}
			})
		}
	})
})

/*확진자*/
app.post('/diagnosis', function(req, res, next) {
  var chartType = req.body.chartType;
	console.log(chartType);

	if(chartType === "all"){
    var set = "SET @sum = 0;"
		var sql = "SELECT DATE_FORMAT(a.date, '%y-%m-%d') as horiz, (@sum:=@sum+a.cnt) as vertic FROM (SELECT date, count(*) as cnt FROM diagnosis GROUP BY date ORDER BY date) a;";
		pool.query(set, function(){
			pool.query(sql, function(err, rows){
				if(err) console.log("그래프 에러");
				else{
					res.send(rows);
				}
			});
		})
	}
	else if(chartType === "year"){
		var sql = "SELECT DATE_FORMAT(date,'%y-%m-%d') as horiz, count(*) as vertic FROM diagnosis WHERE date > date(subdate(now(), INTERVAL 1 YEAR)) GROUP BY date ORDER BY date;";
		pool.query(sql, function(err, rows){
			if(err) console.log("그래프 에러");
			else{
				res.send(rows);
			}
		});
	}
	else if(chartType === "month"){
		var sql = "SELECT DATE_FORMAT(date,'%y-%m-%d') as horiz, count(*) as vertic FROM diagnosis WHERE date > date(subdate(now(), INTERVAL 1 MONTH)) GROUP BY date ORDER BY date;";
		pool.query(sql, function(err, rows){
			if(err) console.log("그래프 에러");
			else{
				res.send(rows);
			}
		});
	}
	else if(chartType === "week"){
		var sql = "SELECT DATE_FORMAT(date,'%y-%m-%d') as horiz, count(*) as vertic FROM diagnosis WHERE date > date(subdate(now(), INTERVAL 7 DAY)) GROUP BY date ORDER BY date;";
		pool.query(sql, function(err, rows){
			if(err) console.log("그래프 에러");
			else{
				res.send(rows);
			}
		});
	}
	else if(chartType === "local"){
		var sql = "SELECT location as horiz, count(*) as vertic FROM diagnosis GROUP BY location ORDER BY location;";
		pool.query(sql, function(err, rows){
			if(err) console.log("그래프 에러");
			else{
				res.send(rows);
			}
		});
	}
	else if(chartType === "age"){
		var sql = "SELECT case when age < 20 then '10대' when age < 30 then '20대' when age < 40 then '30대' when age < 50 then '40대' when age < 60 then '50대' when age >= 60 then '60대 이상' end as horiz, count(*) as vertic FROM diagnosis GROUP BY horiz ORDER BY horiz;";
		pool.query(sql, function(err, rows){
			if(err) console.log("그래프 에러");
			else{
				res.send(rows);
			}
		});
	}
})

/*접종자*/
app.post('/inoculation', function(req, res, next) {
  var chartType = req.body.chartType;
	console.log(chartType);
	var sql = "";

	if(chartType === "all"){
		sql = "SELECT DATE_FORMAT(idate,'%y-%m-%d') as horiz, count(*) as vertic FROM inoculation NATURAL JOIN `member` GROUP BY idate ORDER BY idate;";
		
	}
	else if(chartType === "year"){
		sql = "SELECT DATE_FORMAT(idate,'%y-%m-%d') as horiz, count(*) as vertic FROM inoculation NATURAL JOIN `member` WHERE idate > date(subdate(now(), INTERVAL 1 YEAR)) GROUP BY idate ORDER BY idate;";
		
	}
	else if(chartType === "month"){
		sql = "SELECT DATE_FORMAT(idate,'%y-%m-%d') as horiz, count(*) as vertic FROM inoculation NATURAL JOIN `member` WHERE idate > date(subdate(now(), INTERVAL 1 MONTH)) GROUP BY idate ORDER BY idate;";
		
	}
	else if(chartType === "week"){
		sql = "SELECT DATE_FORMAT(date,'%y-%m-%d') as horiz, count(*) as vertic FROM inoculation WHERE date > date(subdate(now(), INTERVAL 7 DAY)) GROUP BY date ORDER BY date;";
		
	}
	else if(chartType === "local"){
		sql = "SELECT SUBSTRING_INDEX(maddress, ' ', 1) as horiz, count(*) as vertic FROM inoculation NATURAL JOIN `member` GROUP BY SUBSTRING_INDEX(maddress, ' ', 1) ORDER BY horiz;";
		
	}
	else if(chartType === "age"){
		sql = "SELECT case when mage < 20 then '10대' when mage < 30 then '20대' when mage < 40 then '30대' when mage < 50 then '40대' when mage < 60 then '50대' when mage >= 60 then '60대 이상' end as horiz, count(*) as vertic FROM member NATURAL JOIN inoculation GROUP BY horiz ORDER BY horiz;";
		
	}
	else if(chartType === 'ratio'){
		sql = "SELECT case when I.vname='얀센' or I.inum = 2 then '2차 접종 완료' when I.vname!='얀센' and I.inum = 1 then '1차 접종 완료' else '미접종' end as horiz, count(*) as vertic FROM member M LEFT OUTER JOIN inoculation I ON M.mindex=I.mindex GROUP BY horiz ORDER BY horiz;";
	}
	pool.query(sql, function(err, rows){
		if(err) console.log("그래프 에러");
		else{
			console.log(rows);
			res.send(rows);
		}
	});
})

/*잔여백신*/
app.post('/leftvaccine', function(req, res){
	var hname = req.body.hname;
	var vname = req.body.vname;
	var local = req.body.local;

	console.log(hname, vname, local);

	if(hname === "" && local === "empty" && vname === "empty"){
		var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM cancel NATURAL JOIN hospital GROUP BY hname, vname";
	}
	else if(local==="empty" && vname==="empty"){
    var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM `CANCEL` C, `HOSPITAL` H WHERE C.hindex = H.hindex AND H.hname LIKE ? GROUP BY C.vname;"
		var data = '%'+hname+'%'
	}
	else if(hname==="" && vname==="empty"){
		var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM `CANCEL` NATURAL JOIN `HOSPITAL` WHERE SUBSTRING_INDEX(haddress, ' ', 1) = ? GROUP BY vname;"
		var data = local
	}
	else if(hname==="" && local==="empty"){
	  var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM (`CANCEL` C JOIN `HOSPITAL` H ON C.hindex = H.hindex) WHERE C.hindex = ANY (SELECT C.hindex FROM vaccine WHERE C.vname=?) GROUP BY H.hname;"
		var data = vname;
	}
	else if(vname === "empty"){
		var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM cancel NATURAL JOIN hospital WHERE hname LIKE ? AND SUBSTRING_INDEX(haddress, ' ', 1) = ? GROUP BY vname;"
		var data = ['%'+hname+'%', local]
	}
	else if(hname === ""){
		var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM `CANCEL` C INNER JOIN `HOSPITAL` H WHERE C.hindex = H.hindex AND C.hindex = ANY (SELECT C.hindex FROM `VACCINE` WHERE C.vname = ?) GROUP BY H.hname HAVING SUBSTRING_INDEX(haddress, ' ', 1) = ?;"
    var data = [vname, local];
	}
	else if(local === "empty"){
		var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM cancel NATURAL JOIN hospital WHERE hname LIKE ? AND vname=? GROUP BY vname;"
		var data = ['%'+hname+'%',vname];
	}
	else{
		var sql = "SELECT cindex, hname, haddress, vname, count(*) AS vcount FROM cancel NATURAL JOIN hospital WHERE hname LIKE ? AND vname=? GROUP BY hname HAVING SUBSTRING_INDEX(haddress, ' ', 1) = ?;"
		var data = ['%'+hname+'%', vname, local];
	}
	pool.query(sql, data, function(err,rows){
		if(err) console.log("잔여 백신 리스트 에러");
		else {
			if(rows.length === 0){
				res.send(false)
			}
			else{
				console.log(rows);
				res.send(rows)
			}
		}
	})
})
app.post('/getRSV', function(req, res){
	let id = req.body.id;

	var sqlMindex = "SELECT * FROM `MEMBER` WHERE id=?";
	var sqlRsv = "SELECT R.rdate, R.rtime, H.hname, vname FROM `RESERVATION` AS R, `HOSPITAL` AS H WHERE H.hindex = R.hindex and mindex = ?;"
	pool.query(sqlMindex, id, function(err,row){
		if(err) console.log("내 예약 이름 정보 에러");
		else{
			var mindex = row[0].mindex;
			pool.query(sqlRsv, mindex, function(err,row1){
			if(err) console.log("내 예약 정보 에러");
			else{
				console.log(row1);
				if(row1.length == 0){
					res.send(false);
				}
				else{
					res.send(row1);
				}
			}
		})
		}
	})
})
app.post('/getInum', function(req, res){
	let id = req.body.id;
	var sqlIno = "SELECT I.idate, H.hname, I.vname, I.inum FROM `INOCULATION` AS I, `HOSPITAL` AS H, `MEMBER` AS M WHERE H.hindex = I.hindex and M.mindex = I.mindex and M.id = ?";
	pool.query(sqlIno, id, function(err,row){
		if(err) console.log("내정보 에러");
		else{
			if(row.length === 0){
				res.send(false)
			}
			else {
				console.log(row[0]);
				res.send(row[0]);
			}
		}
	})
})
app.post('/leftRSV', function(req, res){
	var id = req.body.id;
	var cindex  = req.body.cindex;
	var data = [cindex, id];

	var sqlForleftRSV = "SELECT M.mname, H.hname, H.haddress, C.vname FROM `CANCEL` AS C, `HOSPITAL` AS H, `MEMBER` AS M WHERE H.hindex = C.hindex and C.cindex = ? and M.id = ?"
	pool.query(sqlForleftRSV, data, function(err, row){
		if(err) console.log('잔여백신 불러오기 실패')
		else {
			console.log(row);
			res.send(row)
		}
	})
})
app.post('/goRSV', function(req, res){
	var id = req.body.id;
	var hname = req.body.hname;

	var cindex = req.body.cindex;
	var vname = req.body.vname;
	var rdate = req.body.rdate;
	var rtime = req.body.rtime
	var reservation = req.body.reservation;
	var inoculation = req.body.inoculation; 

	var sqlMindex = "SELECT mindex FROM `MEMBER` WHERE id=?";
	var sqlHindex = "SELECT hindex FROM `HOSPITAL` WHERE hname=?";
	var sqlVinterval = "SELECT vinterval FROM `VACCINE` WHERE vname=?";
	var mindex = "";
	var hindex = "";

	pool.query(sqlMindex, id, function(err,row){
		if(err) console.log("mindex 잔여백신에서 불러오기 실패");
		else{
			mindex = row[0].mindex;
			pool.query(sqlHindex, hname, function(err, row){
				if(err) console. log("hindex 잔여백신에서 불러오기 실패");
				else{
					hindex = row[0].hindex;
					pool.query(sqlVinterval, vname, function(err, row){
						if( err) console. log("vindex 잔여백신에서 불러오기 실패");
						else{
							vinterval = row[0].vindex;
							console.log(mindex, hindex, vinterval);
							if(inoculation.length == 0){
								if(reservation.length == 0){ //예약 없었을 때
									var sqlRSV1 = "INSERT INTO reservation (mindex, vname, hindex, rdate, rtime) VALUES (?,?,?,?,?);"
									var data = [mindex, vname, hindex, rdate, rtime]
									if(vname == '얀센'){
										pool.query(sqlRSV1, data, function(err, row){
											if(err) console.log("에러");
											else{
												console.log("성공");
												res.send(true)
											}
										})
									}
									else{
										var sqlRSV2 = "INSERT INTO reservation (mindex, vname, hindex, rdate, rtime) VALUES (?,?,?,?,?);"
										pool.query(sqlRSV1, data, function(err, row){
											if(err) console.log("에러");
											else{
												var rdate2 = rdate+vinterval;
												data = [mindex, vname, hindex, rdate2, rtime]
												pool.query(sqlRSV2, data, function(err, row){
													if(err) console.log("에러");
													else{
														console.log("성공")
														res.send(true)
													}
												})
											}
										})
									}
		
								}
								else if(inoculation.length == 1){
		
								}
								else{
		
								}
							}
							else if(inoculation.length == 1){
								
							}
						}
					})
				}
			})
		}
	})
})


function dateInMyFormat(source, delimiter = '-') {
	const year = source.getFullYear();
	const month = plusZero(source.getMonth()+1);
	const day = plusZero(source.getDate());
	return [year, month, day].join(delimiter);
}

function plusZero(value) {
	if (value >= 10) return value;
	return `0${value}`;
}


app.listen(PORT, () => {
	console.log('server run: 8080');
})