import React, { Component } from 'react';
import '../css/mypage.css';
import Nav from './navigator';

class MyPage extends Component {
   constructor(props){
      super(props)
      this.state = {
         /*내정보*/
         name : "",
         id : "",
         birth : "",
         tel : "",
         sex : "",
         age : "",
         address : "",
         
         reservation : [],
         inoculation : [],
      }
      this.getMyInfo(sessionStorage.getItem('userId'))
   }
   
   getMyInfo = (id) => {
      const data = {
         id: id,
         reservation : this.state.reservation,
      }

      fetch("http://localhost:8080/myInfo", {
         method: "post",
         headers: {
            "content-type" : "application/json",
         },
         body : JSON.stringify(data),
      })
      .then((res) => res.json())
      .then((json) => {
         this.setState({
            name : json.mname,
            id : json.id,
            birth : (Number(json.rrn.substr(0,2)) < 22 ? '20'+json.rrn.substr(0,2)+'.'+json.rrn.substr(2,2)+'.'+json.rrn.substr(4,2) : '19'+json.rrn.substr(0,2)+'.'+json.rrn.substr(2,2)+'.'+json.rrn.substr(4,2)),
            tel : json.mphone.substr(0,3)+'-'+json.mphone.substr(3,4)+'-'+json.mphone.substr(7,4),
            sex : (json.sex == 'F' ? '여자' : '남자'),
            age : json.mage,
            address : json.maddress,
         })
      })

      fetch("http://localhost:8080/myInoInfo", {
         method: "post",
         headers: {
            "content-type" : "application/json",
         },
         body : JSON.stringify(data),
      })
      .then((res) => res.json())
      .then((json) => {
         if(json !== false){
            this.setState({
               inoculation: getIno(json.idate.substr(0,10), json.hname, json.vname, json.inum)
            })
         }
         else {
            this.setState({
               inoculation: { inum : 0 }
            })
         }
      })

      fetch("http://localhost:8080/myRsvInfo", {
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
            var vState = 1; /*여기추가*/
            for(let i=0; i<json.length; i++){
               if ( new Date(json[i].rdate) < today ){
                  this.setState({
                     inoculation: makeIno(json[i].rdate.substr(0,10), json[i].hname, json[i].vname, this.state.inoculation.inum+1)
                  })
                  console.log(this.state.inoculation);
               }   
               else if( new Date(json[i].rdate) === today & getTime(json[i].rtime) < today.getTime()){
                  this.setState({
                     inoculation: makeIno(json[i].rdate.substr(0,10), json[i].hname, json[i].vname, this.state.inoculation.inum+1)
                  })
                  console.log(this.state.inoculation);
               }
               else {
                  if(json.length == 2){
                     this.setState({
                        reservation: this.state.reservation.concat(
                           getRsv(json[i].rdate.substr(0,10), json[i].rtime, json[i].hname, json[i].vname, vState) /*d여기수정*/
                        )
                     })
                  }
                  else {
                     if(json.length == 1){
                        this.setState({
                           reservation: this.state.reservation.concat(
                              getRsv(json[i].rdate.substr(0,10), json[i].rtime, json[i].hname, json[i].vname, this.state.inoculation.inum+1) /*d여기수정*/
                           )
                        })
                     }
                  }
               }
               vState++; /*여기추가*/
            }
         }
      })
      
      function getTime(time){
         return Number(time.substr(0,2))
      }

      function getRsv(rdate, rtime, hname, vname, vState){
         return { rdate, rtime, hname, vname, vState }
      }

      function makeIno(idate, hname, vname, inum){
         return { idate, hname, vname, inum }
      }

      function getIno(idate, hname, vname, inum){
         return { idate, hname, vname, inum }
      }
   }

   render() {
      const rsvTable = this.state.reservation.map((list) => (
         <tr>
            <td className = "tdContent">{list.rdate}</td>
            <td className = "tdContent">{list.rtime}</td>
            <td className = "tdContent">{list.hname}</td>
            <td className = "tdContent">{list.vname}</td>
            <td className = "tdContent">{`${list.vState}차`}</td>
         </tr>
      ))

      const inoTable = (
         <table className="mypageTable">
            <tr>
               <td className="tdTitle">접종 날짜</td>
               <td className="tdTitle" id="hname">접종 병원</td>
               <td className="tdTitle" id="vname">접종 백신</td>
               <td className="tdTitle">접종 차수</td>
            </tr>
            <tr>
               <td className = "tdContent">{this.state.inoculation.idate}</td>
               <td className = "tdContent">{this.state.inoculation.hname}</td>
               <td className = "tdContent">{this.state.inoculation.vname}</td>
               <td className = "tdContent">{`${this.state.inoculation.inum}차`}</td>
            </tr>
         </table>
      )

      return (
         <div>
            <Nav/>
            <div id = "personal">
               <div className="tableTitle">신상정보 조회</div>
               <table className="mypageTable">
                  <tr>
                     <td className="tdTitle">이름</td>
                     <td className="tdContent">{this.state.name}</td>
                     <td className="tdTitle">아이디</td>
                     <td className="tdContent">{this.state.id}</td>
                  </tr>
                  <tr>
                     <td className="tdTitle">생일</td>
                     <td className="tdContent">{this.state.birth}</td>
                     <td className="tdTitle">전화번호</td>
                     <td className="tdContent">{this.state.tel}</td>
                  </tr>
                  <tr>
                     <td className="tdTitle">성별</td>
                     <td className="tdContent">{this.state.sex}</td>
                     <td className="tdTitle">나이</td>
                     <td className="tdContent">{this.state.age}</td>
                  </tr>
                  <tr>
                     <td className="tdTitle">주소</td>
                     <td className="tdContent" colspan="3">{this.state.address}</td>
                  </tr>
               </table>
            </div>

            <div id="reservation">
               <div className="tableTitle">백신 예약 정보</div>
                  {(this.state.reservation.length !== 0 && this.state.inoculation.inum !==2)&&
                     (
                        <table className="mypageTable">
                           <tr>
                              <td className="tdTitle">예약 날짜</td>
                              <td className="tdTitle">예약 시간</td>
                              <td className="tdTitle" id="hname">예약 병원</td>
                              <td className="tdTitle" id="vname">예약 백신</td>
                              <td className="tdTitle">접종 차수</td>
                           </tr>
                           {rsvTable}
                        </table>
                     )
                  }               
                  {(this.state.reservation.length === 0 || this.state.inoculation.inum === 2) && (<div className="inoText">백신 예약 정보가 없습니다🙄</div>)}
            </div>

            <div id="inoculation">
               <div className = "tableTitle">백신 접종 현황</div>
                  {this.state.inoculation.inum === 0 && (<div className="inoText">접종 정보가 없습니다😥</div>)}
                  {(this.state.inoculation.inum === 1 && this.state.inoculation.vname !== '얀센') && inoTable}
                  {(this.state.inoculation.inum === 2 || this.state.inoculation.vname === '얀센') && (<div className="inoText">백신 접종을 완료하셨습니다😊</div>)}
            </div>
         </div>
      )
   }
}

const Status = {

}


export default MyPage;