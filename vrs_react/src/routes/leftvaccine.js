import React, { Component } from 'react';
import '../css/leftvaccine_rsv.css';
import Nav from './navigator';
import { Link } from 'react-router-dom';
import LeftRSV from './leftvaccine_rsv';

class LeftVaccine extends Component {
   state = {
      id : sessionStorage.getItem('userId'),
      hname : "",
      local : "empty",
      vname : "empty",

      cancelList: [],
   }

   setHname = (e) => {
      this.setState({
        hname : e.target.value
      })
   }

   setLocal = (e) => {
      this.setState({
        local : e.target.value
      })
   }

   setVname = (e) => {
      this.setState({
        vname : e.target.value
      })
   }

   search = () => {
			this.setState({
				cancelList : [],
			})

      const data = {
        hname : this.state.hname,
        local : this.state.local,
        vname : this.state.vname
      }

      function loadData(cindex, hname, haddress, vname, vcount){
        return { cindex, hname, haddress, vname, vcount }
      }

      fetch("http://localhost:8080/leftvaccine", {
        method: "post",
        headers: {
          	"content-type" : "application/json",
        },
        body : JSON.stringify(data),
      })
      .then((res) => res.json())
      .then(json => {
				console.log(json);
				if(json !== false){
         for(let i=0; i<json.length; i++){
            this.setState({
               cancelList: this.state.cancelList.concat(
                  loadData(json[i].cindex, json[i].hname, json[i].haddress, json[i].vname, json[i].vcount)
               ),
            })
       	  }
				}
				else {
					this.setState({
						cancelList : [],
					})
				}
        console.log(this.state.cancelList);
      })
   }

   render () {
      const cancelTable = this.state.cancelList.map((list) => (
         <tr id = "tablecontent">
            <td id="td">{list.hname}</td>
            <td id="td">{list.haddress}</td>
            <td id="td">{list.vname}</td>
            <td id="td">{list.vcount}</td>
            <td id="td"><Link to={`/leftvaccine/${list.cindex}`} element={<LeftRSV/>} id="a_reserv">예약</Link></td>
         </tr>
      ))

      return (
         <div>
            <Nav/>
            <div id="form">
               <form>
                  <div id="searchbox">
                     병원
                     <input id="searchbar" minlength="2" type="text" name="hospital" onChange={this.setHname}/>
                     지역
                     <select id="searchbar" name="local" onChange={this.setLocal}>
                        <option value="empty">선택없음</option>
                        <option>강원도</option>
                        <option>경기도</option>
                        <option>경상북도</option>
                        <option>경상남도</option>
                        <option>광주광역시</option>
                        <option>대구광역시</option>
                        <option>대전광역시</option>
                        <option>부산광역시</option>
                        <option>서울특별시</option>
                        <option>세종특별자치시</option>
                        <option>울산광역시</option>
                        <option>인천광역시</option>
                        <option>전라북도</option>
                        <option>전라남도</option>
                        <option>제주특별자치도</option>
                        <option>충청북도</option>
                        <option>충청남도</option>
                     </select>
                     백신
                     <select id="searchbar" name="vaccine" onChange={this.setVname}>
                           <option value="empty">선택없음</option>
                           <option>화이자</option>
                           <option>모더나</option>
                           <option>아스트라제네카</option>
                           <option>얀센</option>
                     </select>
                     <button id="searchbutton" type="button" onClick={this.search}>검색</button>
                     </div>
											{this.state.cancelList.length === 0 && <div id="searchResult">검색 내역이 없습니다😂</div>}
                      {this.state.cancelList.length !== 0 && 
												<table id="table">
													<tr id="tabletitle">
														<td id="td">병원</td>
														<td id="td">지역</td>
														<td id="td">백신</td>
														<td id="td">개수</td>
														<td id="td">잔여 백신 예약하기</td>
													</tr>
													{cancelTable}
												</table>
											}
                  </form>
            </div>
         </div>
      )
   }
}

export default LeftVaccine;