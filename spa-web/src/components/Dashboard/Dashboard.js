import React from 'react';
import BarChart from '../BarChart/BarChart';
import ParetoChart from '../ParetoChart/ParetoChart';
import LineChart from '../LineChart/LineChart';
import './Dashboard.css';

const Dashboard = () => {
    return ( 
        <div className='grid-wrapper'>
            <div className='rolling-bar-chart'>
                <BarChart />
            </div>
            <div className='top-10-line-chart'>
                <LineChart />
            </div>
            <div className='pareto'>
                <ParetoChart />
            </div>
            <div className='parts-table'>
                Parts Table
            </div>
        </div>
     );
}
 
export default Dashboard;