import React, { Component } from 'react';
import '../css/join.css';

class Join extends Component {
	state = {
		name : "",
		rrn : "",
		id : "",
		passwd : "",
		tel : "",
		address : "", 
		idDupCheck : false,
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			name : this.state.name,
			rrn : this.state.rrn,
			id : this.state.id,
			passwd : this.state.passwd,
			tel : this.state.tel,
			address : this.state.address
		}
		
		const checkDup = this.state.idDupCheck
		if(checkDup == false){
			alert('아이디 중복을 확인해주세요');
			return;
		}

		fetch("http://localhost:8080/join", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(data),
		})
		.then((res) => res.json())
		.then((json) => {
			if(json === true){
				alert("회원가입 성공!(로그인 페이지로 이동합니다)");
				document.location.href = '/login';
			} 
			else{
				alert("이미 가입된 유저입니다");
			}
		})
	}

	checkDup = () => {
		const id = {
			id: this.state.id,
		}

		fetch("http://localhost:8080/checkId", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(id),
		})
		.then((res) => res.json())
		.then((json) => {
			if(json === true){
				alert("중복된 아이디 입니다");
				this.setState({
					idDupCheck : false,
				})
			} 
			else{
				console.log(json);
				alert("아이디 사용이 가능합니다");
				this.setState({
					idDupCheck : true,
				})
			}
		})
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name] : e.target.value
		})
	}

	render() {
		return (
			<form id="join" onSubmit={this.handleSubmit}>
            <div align="center">
								<div id = "joinTitle">회원가입</div>
                <table className = "joinTable">
                    <tr>
                        <td className="joinTableTitle">이름</td>
                        <td className="padding"><input onChange = {this.handleChange} className="input" type="text" name="name" id="name" size="10" maxlength="10" required/></td>
                    </tr>
                    <tr>
                        <td className="joinTableTitle">주민번호</td>
                        <td className="padding"><input onChange = {this.handleChange} className="input" type="password" name="rrn" id="rrn" size="14" minlength="14" maxlength="14" required/></td>
                    </tr>
                    <tr>
                        <td className="joinTableTitle">아이디</td>
                        <td className="padding">
													<input onChange = {this.handleChange} className="input" type="text" name="id" id="id" size="12" minlength="4" maxlength="12" required/>
													<button type="button" id="dupCheckBtn" onClick={this.checkDup}>중복 확인</button>
												</td>
                    </tr>
                    <tr>
                        <td className="joinTableTitle">비밀번호</td>
                        <td className="padding"><input onChange = {this.handleChange} className="input" type="password" name="passwd" id="passwd" size="12" maxlength="12" required/></td>
                    </tr>
                    <tr>
                        <td className="joinTableTitle">전화번호</td>
                        <td className="padding"><input onChange = {this.handleChange} className="input" type="text" name="tel" id="tel" size="11" maxlength="11" required/></td>
                    </tr>
                    <tr>
                        <td className="joinTableTitle">주소</td>
                        <td className="padding"><input onChange = {this.handleChange} className="input" type="text" name="address" id="address" size="30" maxlength="50" required/></td>
                    </tr>
                </table>
                <div><button type="submit" className="button">가입하기</button></div>
                <div className="text">
                  <div>* 주민번호는 'xxxxxx-xxxxxxx' 형식으로 입력해 주세요.</div>
                  <div>* 휴대폰 번호는 '010xxxxxxxx' 형식으로 입력해 주세요.</div>
                </div>
            </div>
			</form>
		)
	}
}

export default Join;