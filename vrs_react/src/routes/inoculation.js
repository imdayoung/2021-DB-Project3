import React, { Component } from 'react';
import '../css/inoculation.css';
import Nav from './navigator';
import Chart from 'react-google-charts';

class Inoculation extends Component {
	constructor(props){
		super(props)
		this.state = {
			chartType: 'all',
			chartData: [],
		}
		this.getGraph('all');
	}

	setOption = (e) => {
		//e.preventDefault();
		this.setState({
			chartType : e.target.value,
			chartData : [],
		})
		this.getGraph(e.target.value);
	}
	
	getGraph = (value) => {
		const chartType = {
			chartType: value
		};
		console.log(chartType)
		let tempData = [];

		fetch("http://localhost:8080/inoculation", {
			method: "post",
			headers: {
				"content-type" : "application/json",
			},
			body : JSON.stringify(chartType)
		})
		.then((res) => res.json())
		.then((json) => {
			console.log(json);

			for(let i=0; i<json.length; i++){
				tempData.push(makeData(json[i].horiz,json[i].vertic))
			}
			this.setState({
				chartData: tempData,
			})
		})
		function makeData(horiz, vertic){
			return [horiz, vertic];
		}
	}

	render(){
	const inoculationTable = (type, chartData) => {
			if (type === 'all'){
				var option = {
					title: '전체 기간 접종자 현황',
          legend: 'none',
          colors: ['#008282'],
				}
				return (
					<div id="chart">
						<Chart chartType = "LineChart" 		data = {[[ {type: 'string'},{type: 'number'}]].concat(chartData)} options = {option}/>
					</div>
				)
			}
			else if(type === "year"){
				var option = {
					title: '1년 접종자 현황',
          legend: 'none',
          colors: ['#008282'],
				}
				return (
					<div id="chart">
						<Chart chartType = "LineChart" 		data = {[[ {type: 'string'},{type: 'number'}]].concat(chartData)} options = {option}/>
					</div>
				)
			}
			else if(type === "month"){
				var option = {
					title: '한 달 접종자 현황',
          legend: 'none',
          colors: ['#008282'],
				}
				return (
					<div id="chart">
						<Chart chartType = "LineChart" 		data = {[[ {type: 'string'},{type: 'number'}]].concat(chartData)} options = {option}/>
					</div>
				)
			}
			else if(type === "week"){
				var option = {
					title: '일주일 접종자 현황',
          legend: 'none',
          colors: ['#008282'],
				}
				return (
					<div id="chart">
						<Chart chartType = "LineChart" 		data = {[[ {type: 'string'},{type: 'number'}]].concat(chartData)} options = {option}/>
					</div>
				)
			}
			else if(type === "local"){
				var option = {
					title: '지역 접종자 현황',
          legend: 'none',
          colors: ['#008282'],
				}
				return (
					<div id="chart">
						<Chart chartType = "ColumnChart" 		data = {[[ {type: 'string'},{type: 'number'}]].concat(chartData)} options = {option}/>
					</div>
				)
			}
			else if(type === "age"){
				var option = {
					title: '연령별 접종자 현황',
          legend: 'none',
          colors: ['#008282'],
				}
				return (
					<div id="chart">
						<Chart chartType = "LineChart" 		data = {[[ {type: 'string'},{type: 'number'}]].concat(chartData)} options = {option}/>
					</div>
				)
			}
			else if(type === "ratio"){
				var option = {
					title: '접종 완료 비율',
					colors: ['#008282', '#2f528f', '#4daeb2'],
					legend: {position: 'bottom'},
			}
				return (
					<div id="chart">
						<Chart chartType = "PieChart" 	data = {[[ {type: 'string'},{type: 'number'}]].concat(chartData)} options = {option}/>
					</div>
				)
			}
		};

		return(
			<div>
				<Nav/>
				<div id="chartForm">
          <div className="buttons">
						<div className="buttonType">
							<div className="buttonTitle">기간</div> 
            	<button className="btn" type="button" onClick={this.setOption} value="all">전체</button>
            	<button className="btn" type="button" onClick={this.setOption} value="year">1년</button>
            	<button className="btn" type="button" onClick={this.setOption} value="month">1달</button>
            	<button className="btn" type="button" onClick={this.setOption} value="week">1주일</button>
            </div>
						<div className="buttonType">
						<div className="buttonTitle">지역별</div>
							<button className="btn" type="button" onClick={this.setOption} value="local">지역별</button>
						</div>
						<div className="buttonType">
						<div className="buttonTitle">연령별</div>
            	<button className="btn" type="button" onClick={this.setOption} value="age">연령별</button>
						</div>
						<div className="buttonType">    
						<div className="buttonTitle">비율</div>
            	<button className="btn" type="button" onClick={this.setOption} value="ratio">접종비율</button>
						</div> 
					</div>    	
					{inoculationTable(this.state.chartType,this.state.chartData)}
				</div>
			</div>
		)
	}
}

export default Inoculation;