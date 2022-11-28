import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

class Nav extends Component {
	constructor(props){
		super(props);
		this.state = {
			loginId: window.sessionStorage.getItem('userId')
		}
	}

	setlogout = () => {
		window.sessionStorage.clear();
		this.setState({
			loginId: undefined
		})
	}
	
	mustLogin = () => {
		if( window.sessionStorage.getItem('userId') === null ){
			alert('로그인 후 이용 가능합니다')
			document.location.href = '/login';
		}
	}

	render() {
		return (
			<div>
				<div className = "titleSpace" >
					<div className = "title">VRS</div>
					<div className="titleRightSpace">{(this.state.loginId == undefined) ? 
						<Link to = '/login' className = "titleRightSpace">로그인</Link> : 
						<div className = "titleRightSpace">
							<Link to = '/myPage' className = "titleRight">내정보</Link>
							<button className = "logout" onClick={this.setlogout} className = "titleRight">로그아웃</button>
						</div>
					}</div>
				</div>

				<div className = "pageMove">
					<Link to='/reservation/hospital' className = "page" onClick={this.mustLogin}>예약</Link>
					<Link to='/leftvaccine' className = "page" onClick={this.mustLogin}>잔여 백신 예약</Link>
					<Link to='/diagnosis' className = "page">확진자 현황</Link>
					<Link to='/inoculation' className = "page">접종자 현황</Link>
				</div>
			</div>
		);
	}
}

export default Nav;