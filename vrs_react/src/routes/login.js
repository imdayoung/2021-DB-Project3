import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/login.css';

class Login extends Component {
	state = {
		id: "",
		pw: "",
	}

	getID = (e) => {
		e.preventDefault();
		this.setState({
			id: e.target.value,
		});
	}

	getPW = (e) => {
		e.preventDefault();
		this.setState({
			pw: e.target.value,
		});
	}

	login = async () => {
		const data = {
			id: this.state.id,
			pw: this.state.pw,
		};

		const res = await axios.post('http://localhost:8080/login', data)

		if(res.data === true) {
			window.sessionStorage.setItem('userId', data.id);
			document.location.replace("http://localhost:3000/");
		} else {
			alert("해당 로그인 정보가 없습니다");
		}
	}

	render () {
		return (
			<form id ="login">
				<div className="loginForm">
					<div id = "loginTitle">로그인</div>
					<div id = "idSpace">
						<div className = "inputTitle">아이디</div>
						<input className = "loginInput" onChange={this.getID}></input>
					</div>
					<div id = "pwSpace">
						<div className = "inputTitle">비밀번호</div>
						<input type="password" className = "loginInput" onChange={this.getPW}></input>
					</div>
					<button type="button" className = "loginBtn" onClick={this.login}>로그인</button>
					<div className = "join">
						<div>아이디가 없으신가요?</div>
						<div id="tempSpace"></div>
						<Link to="/join">회원가입</Link>
					</div>
				</div>
			</form>
		);
	}
}

export default Login;