import React, { Component } from 'react';
import '../css/leftvaccine.css';
import Nav from './navigator';

class LeftRSV extends Component{
	constructor(props){
		super(props);
		this.state = {
			id : sessionStorage.getItem('userId'),
			cindex : "",
			newRdate : dateInMyFormat(new Date()),

			name : "",
			hname : "",
			haddress : "",
			vname : "",
			vState : "",

			reservation : [],
			inoculation : [],
		}
		this.getInfo()
	}

	getInfo = () => {
		let cindex = document.location.href.split('/');
		this.setState({
			cindex: cindex[cindex.length-1]
		})
		
		const data = {
			id : sessionStorage.getItem('userId'),
			cindex : cindex[cindex.length-1],
		}

		/*예약 여부*/
		fetch("http://localhost:8080/getRSV", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(data),
		})
		.then((res) => res.json())
		.then((json) => {
			if(json.length != 0){
				var today = new Date()
				console.log(today);
				var vState = 1;
				for(let i=0; i<json.length; i++){
					if ( new Date(json[i].rdate) < today ){
						this.setState({
							inoculation: makeIno(json[i].rdate.substr(0,10), json[i].hname, json[i].vname, vState)
						})
						console.log(this.state.inoculation);
					}	
					else if( new Date(json[i].rdate) === today & getTime(json[i].rtime) < today.getTime()){
						this.setState({
							inoculation: makeIno(json[i].rdate.substr(0,10), json[i].hname, json[i].vname, vState)
						})
						console.log(this.state.inoculation);
					}
					else {
						this.setState({
							reservation: this.state.reservation.concat(
								getRsv(json[i].rdate.substr(0,10), json[i].rtime, json[i].hname, json[i].vname, vState)
							)
						})
					}
					vState++;
				}
			}
		})

		/*접종 여부*/
		fetch("http://localhost:8080/getInum", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(data),
		})
		.then((res) => res.json())
		.then((json) => {
			if(json !== false){
				if(this.state.inoculation.length === 0){
					this.setState({
						inoculation: getIno(json.idate.substr(0,10), json.hname, json.vname, json.inum)
					})
				}
				else{
					this.setState({
						inoculation: getIno(json.idate.substr(0,10), json.hname, json.vname, 2)
					})
				}

				if (this.state.reservation.length !== 0){
					this.setState({
						reservation: [ getRsv(this.state.reservation[0].rdate, this.state.reservation[0].rtime, this.state.reservation[0].hname, this.state.reservation[0].vname, Number(json.inum)+1) ]
					})
				}
				console.log(this.state.inoculation);
			}
			else if(this.state.inoculation.length === 0){
				this.setState({
					inoculation: { inum : 0 }
				})
			}
		})

		/*잔여 백신*/
		fetch("http://localhost:8080/leftRSV", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(data),
		})
		.then((res) => res.json())
		.then((json) => {
			this.setState({
				name : json[0].mname,
				hname : json[0].hname,
				haddress : json[0].haddress,
				vname : json[0].vname,
				vState : Number(this.state.inoculation.inum) + 1
			})
			console.log(this.state);
		})

		function getTime(time){
			return Number(time.substr(0,2))
		}

		function getRsv(rdate, rtime, hname, vname, vState){
			return { rdate, rtime, hname, vname, vState }
		}

		function makeIno(idate, hname, vname, vState){
			return { idate, hname, vname, vState }
		}

		function getIno(idate, hname, vname, inum){
			return { idate, hname, vname, inum }
		}
	}

	goRSV = () => {
		/*추가 공정*/
		var id = sessionStorage.getItem('userId');
		var hname = this.state.hname;

		/*이미 완성*/
		var cindex = this.state.cindex;
		var vname = this.state.vname;
		var rdate = this.state.newRdate;
		var rtime = new Date().getHour()+1;
		
		var reservation = this.state.reservation;
		var inoculation = this.state.inoculation;

		console.log("rtime:", rtime);
		
		if(inoculation.inum == 2 || inoculation.vname == '얀센'){
			alert("백신 접종 완료자는 잔여 백신 예약이 불가능합니다")
			return;
		}
		
		var data = [id, hname, cindex, vname, rdate, rtime, reservation, inoculation];
		fetch("http://localhost:8080/goRSV", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(data),
		})
	}

	render() {
		return (
			<div id="form" class="whitebox">
        <form id="reservdata">
            <table id="infotable" border="1">
              <tr>
                  <td id="infotitle">이름</td>
                  <td id="infocontent">{this.state.name}</td>
              </tr>
              <tr>
                  <td id="infotitle">병원</td>
                  <td id="infocontent">{this.state.hname}</td>
              </tr>
              <tr>
                  <td id="infotitle">주소</td>
                  <td id="infocontent">{this.state.haddress}</td>
              </tr>
              <tr>
                  <td id="infotitle">백신</td>
                  <td id="infocontent">{this.state.vname}</td>
              </tr>
              <tr>
                  <td id="infotitle">차수</td>
                  <td id="infocontent">{this.state.vState}차</td>
              </tr>
              <tr>
                  <td id="infotitle">예약 날짜</td>
                  <td id="infocontent">{this.state.newRdate}</td>
              </tr>
            </table>
            <div id="buttons">
                <button id="reservbutton" type="button" onClick={this.goRSV}>예약 하기</button>
                <a id="cancelbutton" href="/leftvaccine">취소</a>
            </div>
        </form>
        </div>
		)
	}
}

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


export default LeftRSV;