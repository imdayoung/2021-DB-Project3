import React, { Component } from 'react';
import '../css/reservation.css';
import Calendar from 'react-calendar';
import Reservation from './reservation_default';

class DateTable extends Component {
	constructor(props){
		super(props);
		this.state = {
			hindex: "",
			loginId: window.sessionStorage.getItem('userId'),
			vname: "",
			selectedDate: "",
			selectedTime: "",
			timeList: [],
		}
	}

	getSelectedDate = (selectedDate) => {
		let hindex = document.location.href.split('/');
		this.setState({
			selectedDate: selectedDate,
			timeList: [],
			hindex: hindex[hindex.length-1]
		});

		let today = new Date();
		let todayDate = today.getDate();
		let todayTime = today.getHours();

		if(today > selectedDate & todayDate !== selectedDate.getDate())
			alert('이전 날짜는 예약할 수 없습니다😂');
		else if(todayDate === selectedDate.getDate() & today.getMonth() === selectedDate.getMonth() & today.getFullYear() === selectedDate.getFullYear()){
			if(todayTime >= '18')
				alert('오늘 예약 시간이 마감되었습니다😂');
			else {
				let arr = [];
				let index = 0;
				if(todayTime >= 9)
					index = todayTime;
				else
					index = 8;
				for(let i = index+1; i<19; i++){
					if(i === 9)
						arr.push('09');
					else
						arr.push(i.toString());
				}
				this.setState({
					timeList: arr,
				})
			}
		}
		else{
			this.setState({
				timeList: ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18']
			})
		}
	}

	getSelectedTime = (e) => {
		if(this.state.vname == ""){
			return alert('백신을 선택해주세요');
		} 

		this.setState({
			selectedTime: e.target.value,
		})

		if(window.confirm(`${e.target.value}시로 예약하시겠습니까?`)){
			this.reservation(e.target.value);
		}
	}
	
	getVname = (e) => {
		this.setState({
			vname: e.target.value
		})
	}

	reservation = (time) => {	
		const para = {
			hindex: this.state.hindex,
			loginId: this.state.loginId,
			vname: this.state.vname,
			selectedDate: dateInMyFormat(this.state.selectedDate),
			selectedTime: time+':00:00',
		};

		fetch("http://localhost:8080/reservation", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(para),
		})
		.then((res) => res.json())
		.then((json) => {
			if(json === true){
				alert("예약되셨습니다");
				document.location.href = '/';
			}
			else{
				alert("예약에 실패했습니다. 메인화면으로 돌아갑니다.");
				document.location.href = '/';
			}
		})
	}

	render(){
		const timeTable = this.state.timeList.map((list) => 
			<div>
				<button className = "btnStyle" onClick={this.getSelectedTime} value={list}>{list+":00"}</button>
			</div>
		)

		return(
			<div>
				<Reservation/>
				<div className = "calendarSpace">
					<div className = "calendarAndTime">
						<div className = "calendarContent">
							<div className = "calendarTitle">날짜</div>
							<Calendar onClickDay={this.getSelectedDate} value = {this.state.inputDate}/>
						</div>
						<div className = "calendarContent">
							<div className = "calendarTitle">백신 & 시간</div>
							<div className = "vaccineTable">
								<label><input type="radio" name="vaccine" value="화이자" className = "vaccine" onClick={this.getVname}/>화이자</label>
								<label><input type="radio" name="vaccine" value="모더나" className = "vaccine" onClick={this.getVname}/>모더나</label>
								<label><input type="radio" name="vaccine" value="아스트라제네카" className = "vaccine" onClick={this.getVname}/>아스트라제네카</label>
								<label><input type="radio" name="vaccine" value="얀센" className = "vaccine" onClick={this.getVname}/>얀센</label>
							</div>
							<div className = "time">{timeTable}</div>
						</div>
					</div>
				</div>
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

export default DateTable;