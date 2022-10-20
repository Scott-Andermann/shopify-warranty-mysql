import React, {useState, useEffect} from 'react';
import BarChart from '../BarChart/BarChart';
import ParetoChart from '../ParetoChart/ParetoChart';
import LineChart from '../LineChart/LineChart';
import PartsTable from '../PartsTable/PartsTable';
import './Dashboard.css';

const Dashboard = () => {

    const [currData, setCurrData] = useState([]);
    const [prevData, setPrevData] = useState([]);
    const [dates, setDates] = useState([]);

    const getBarData = async () => {
        const response = await fetch('http://localhost:5000/bar-chart');
        const result = await response.json()
        setCurrData(result['currentYear'])
        setPrevData(result['previousYear'])
        setDates(result['dates'])
    } 

    useEffect(() => {
        getBarData()
    }, [])

    return ( 
        <div>
            <div className='grid-wrapper'>
                <div className='rolling-bar-chart wrapper'>
                    <BarChart dates={dates} prevData={prevData} currData={currData} title='Total Claims (rolling 12 months)'/>
                </div>
                <div className='top-10-line-chart wrapper'>
                    <LineChart />
                </div>
                <div className='pareto wrapper'>
                    <ParetoChart />
                </div>
                <div className='parts-table wrapper'>
                    <PartsTable />
                </div>
            </div>
        </div>
     );
}
 
export default Dashboard;