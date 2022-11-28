import React, { Component } from 'react';
import '../App.css';
import Nav from './navigator';

class Main extends Component {
	constructor(props){
		super(props);
		this.state = {
			diagnosis: "",
			inoculation: "",
		}
		this.getMainInoNum();
		this.getMainDiaNum();
	}
	
	getMainInoNum = () => {
		const ino= {
			inoculation: this.state.inoculation
		}
		fetch("http://localhost:8080/main/inoculation", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(ino),
		})
		.then((res) => res.json())
		.then((json) => {
			console.log(json)
			console.log(json.ICOUNT);
			this.setState({
				inoculation: json.ICOUNT
			})
		})
	}

	getMainDiaNum = () => {
		const dia= {
			diagnosis: this.state.diagnosis
		}
		fetch("http://localhost:8080/main/diagnosis", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(dia),
		})
		.then((res) => res.json())
		.then((json) => {
			console.log(json)
			console.log(json.DCOUNT);
			this.setState({
				diagnosis: json.DCOUNT
			})
		})
	}

	render() {
		return (
			<div>
				<Nav/>
				<div className="mainInfoSpace">
					<div className="mainInfo">
						<div className="mainInfoName">오늘 확진자</div>
						<div className="mainInfoNum">
							<div className="mainNum">{this.state.diagnosis}</div>
							<div className="mainInfo">명</div>
						</div>
					</div>
					<div className="mainInfo">
						<div className="mainInfoName">오늘 접종자</div>
						<div className="mainInfoNum">
							<div className="mainNum">{this.state.inoculation}</div>
							<div className="mainInfo">명</div>
						</div>
					</div>
				</div>
				<img src="/banner.png" alt="이미지" width="100%"/>
			</div>
		)
	}
}

export default Main;