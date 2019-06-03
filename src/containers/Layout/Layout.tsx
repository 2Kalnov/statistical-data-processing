import React, { Component } from 'react';
import SmallDataDashboard from '../SmallDataDashboard/SmallDataDashboard';
import BigDataDashboard from '../BigDataDashboard/BigDataDashboard';
import './Layout.css';

type StatisticalDataProcessingLayout = {
	dashboardType: string
};

class Layout extends Component<{}, StatisticalDataProcessingLayout> {
	constructor(props: any) {
		super(props);
		this.state = {
			dashboardType: ''
		};
	}

	handleDashboardChange = (dashboardType: string) => {
		this.setState({dashboardType: dashboardType});
	}

	render() {
		let dataDashboard;
		switch(this.state.dashboardType)
		{
			case 'bigData':
				dataDashboard = <BigDataDashboard/>
				break;
			case 'smallData':
				dataDashboard = <SmallDataDashboard/>
				break;
			default: 
				dataDashboard = <p>Выберите тип статистических данных</p>
		}

		const dashboardTypeTabs = [
      <span 
        key="smallData" 
        className={this.state.dashboardType === 'smallData' ? 'active' : ''}
        onClick={() => this.handleDashboardChange('smallData')}
      >Небольшой массив данных (до 100)</span>,
      <span 
        key="bigData" 
        className={this.state.dashboardType === 'bigData' ? 'active' : ''}
        onClick={() => this.handleDashboardChange('bigData')}
      >Большой массив данных (не менее 100)</span>
    ];

		return (
			<div className="layout">
        <h1 className="page-header" style={{textAlign: 'center'}}>Обработка статистических данных</h1>
        <div className="dataDashboardTabs flexbox">
          {dashboardTypeTabs}
        </div>
        {dataDashboard}
      </div>
		);
	}
}

export default Layout;