import React, { Component } from 'react';
import '../App.css';
import Nav from './navigator'

class Reservation extends Component {
	render(){
		return(
			<div>
				<Nav/>

				<div className = "descriptionContainer">
					<div className = "descriptionSpace">
						<div className = "divider"></div>
						<div className = "description">코로나19 백신 접종 예약</div>
						<div className = "description">지금바로 예약 하세요</div>
						<div className = "divider"></div>
					</div>
				</div>

				<div className = "warningSpace">
					<div className = "warning">
						<div>주의사항</div>
						<div>1차 백신 날짜를 선택합니다.</div>
						<div>각 백신 종류에 따라 2차 백신 날짜가 자동으로 예약됩니다</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Reservation;