import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './routes/main'

import Login from './routes/login';
import HospitalTable from './routes/reservation_hospital';
import DateTable from './routes/reservation_date';
import Diagnosis from './routes/diagnosis';
import Inoculation from './routes/inoculation';
import Join from './routes/join';
import MyPage from './routes/mypage';
import LeftVaccine from './routes/leftvaccine';
import LeftRSV from './routes/leftvaccine_rsv';

class Root extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<App/>
				</BrowserRouter>
			</div>
		)
	}
}

class App extends Component {
 	render(){
		return (
			<Routes>
				<Route exact path = '/' element={<Main/>}/>

				<Route exact path = '/login' element={<Login/>}/>
				<Route path = '/join' element={<Join/>}/>
				<Route path = '/mypage' element={<MyPage/>}/>

				<Route path = '/reservation/hospital' element={<HospitalTable/>}/>
				<Route path = '/reservation/date/:hindex' element={<DateTable/>}/>

				<Route path = '/leftvaccine' element={<LeftVaccine/>}/>
				<Route path = '/leftvaccine/:cindex' element={<LeftRSV/>}/>

				<Route path = '/diagnosis' element={<Diagnosis/>}/>
				<Route path = '/inoculation' element={<Inoculation/>}/>

			</Routes>
		);
	}
}

export default Root;
