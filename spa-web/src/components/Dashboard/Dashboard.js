import React, {useState, useEffect} from 'react';
import BarChart from '../BarChart/BarChart';
import ParetoChart from '../ParetoChart/ParetoChart';
import LineChart from '../LineChart/LineChart';
import PartsTable from '../PartsTable/PartsTable';
import LoadAnimation from '../LoadAnimation/LoadAnimation';
import './Dashboard.css';

const Dashboard = ({setBaseData, setHeading}) => {

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
        setHeading('Warranty Overview')
    }, [])

    return ( 
        <main>
            <div className='grid-wrapper'>
                <div className='rolling-bar-chart wrapper'>
                    {currData.length > 0 ? <BarChart dates={dates} prevData={prevData} currData={currData} title='Total Claims (rolling 12 months)' height={360}/> : <LoadAnimation /> }
                </div>
                <div className='top-10-line-chart wrapper'>
                    {currData.length > 0 ? <LineChart height={400}/> : <LoadAnimation /> }
                </div>
                <div className='pareto wrapper'>
                    {currData.length > 0 ? <ParetoChart height={400}/> : <LoadAnimation />}
                </div>
                <div className='parts-table wrapper'>
                    {currData.length > 0 ? <PartsTable setBaseData={setBaseData}/> : <LoadAnimation />}
                </div>
            </div>
        </main>
     );
}
 
export default Dashboard;