import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/reservation.css';
import Reservation from './reservation_default';

class HospitalTable extends Component {
	state = {
		inputArea: "",
		inputName: "",
		hospitalList: [],
	}

	inputAreaChange = (e) => {
		this.setState({
			inputArea: e.target.value,
		});
	}

	inputNameChange = (e) => {
		this.setState({
			inputName: e.target.value,
		});
	}

	getList = () => {
		this.setState({hospitalList: []});
		const para = {
			inputArea: this.state.inputArea,
			inputName: this.state.inputName
		};

		function loadData(hindex, hname, hphone, haddress){
			return { hindex, hname, hphone, haddress }
		}

		fetch("http://localhost:8080/getList", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(para),
		})
		.then((res) => res.json())
		.then((json) => {
			for(let i = 0; i< json.length; i++){
				this.setState({
					hospitalList: this.state.hospitalList.concat(
						loadData(json[i].hindex, json[i].hname, json[i].hphone, json[i].haddress)
					),
				})
			}
			console.log(json);
		})
	}

	render() {
		const hospitalTable = this.state.hospitalList.map((list) => (
			<tr>
				<th><Link to={`/reservation/date/${list.hindex}`} className = "linkStyle">{list.hname}</Link></th>
				<th><div className = "tableInStyle">{list.hphone}</div></th>
				<th><div className = "tableInStyle">{list.haddress}</div></th>
			</tr>
		));

    return (
      <div>
				<Reservation/>
				<div className = "searchTabSpace">
				<div className = "searchTab">
					<div id="area">지역</div>
					<select id = "selectArea" onChange={this.inputAreaChange} name>
						<option value="">시/도</option>
						<option value="서울특별시">서울특별시</option>
						<option value="부산광역시">부산광역시</option>
						<option value="대구광역시">대구광역시</option>
						<option value="인천광역시">인천광역시</option>
						<option value="광주광역시">광주광역시</option>
						<option value="울산광역시">울산광역시</option>
						<option value="세종특별자치시">세종특별자치시</option>
						<option value="경기도">경기도</option>
						<option value="강원도">강원도</option>
						<option value="충청남도">충청남도</option>
						<option value="충청북도">충청북도</option>
						<option value="전라북도">전라북도</option>
						<option value="전라남도">전라남도</option>
						<option value="경상북도">경상북도</option>
						<option value="경상남도">경상남도</option>
						<option value="제주특별자치도">제주특별자치도</option>
					</select>
					<div>기관명</div>
					<input type="text" name="검색창" id ="search" onChange={this.inputNameChange}></input>
					<button id="searchButton" onClick={this.getList}>검색</button>
				</div>
				</div>
				<table className = "tableStyle">
					<thead className = "columnStyle">
						<tr>
							<th>병/의원명</th>
							<th>전화번호</th>
							<th>주소</th>
						</tr>
					</thead>
					<tbody>{hospitalTable}</tbody>
				</table>
      </div>
    )
  }
}

export default HospitalTable;