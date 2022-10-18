import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return ( 
        <div className='grid-wrapper'>
            <div className='rolling-bar-chart'>
                BarChart
            </div>
            <div className='top-10-line-chart'>
                Line Chart
            </div>
            <div className='pareto'>
                Pareto Chart
            </div>
            <div className='parts-table'>
                Parts Table
            </div>
        </div>
     );
}
 
export default Dashboard;