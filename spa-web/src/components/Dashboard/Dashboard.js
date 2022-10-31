import React, {useState, useEffect} from 'react';
import BarChart from '../BarChart/BarChart';
import ParetoChart from '../ParetoChart/ParetoChart';
import LineChart from '../LineChart/LineChart';
import PartsTable from '../PartsTable/PartsTable';
import LoadAnimation from '../LoadAnimation/LoadAnimation';
import './Dashboard.css';

const Dashboard = ({setBaseData, setHeading, type}) => {

    const [currData, setCurrData] = useState([]);
    const [prevData, setPrevData] = useState([]);
    const [dates, setDates] = useState([]);

    const getBarData = async (type) => {
        const response = await fetch(`http://localhost:5000/bar-chart?warranty=${type}`);
        const result = await response.json()
        setCurrData(result['currentYear'])
        setPrevData(result['previousYear'])
        setDates(result['dates'])
    } 

    const setTitle = (type) => {
        switch(type) {
            case 'Warranty':
                return 'Total Claims (rolling 12 months)';
            case 'Sales':
                return 'Total Sales (rolling 12 months)';
            default:
                return 'Bar Chart (rolling 12 months)';
        }
    }

    useEffect(() => {
        getBarData(type)
        setHeading(`${type} Overview`)
    }, [type])

    // console.log(currData);
    // console.log(type);

    return ( 
        <main>
            <div className='grid-wrapper'>
                <div className='rolling-bar-chart wrapper'>
                    {currData.length > 0 ? <BarChart dates={dates} prevData={prevData} currData={currData} title={type === 'Warranty' ? 'Total Claims (rolling 12 months)': 'Total Sales (rolling 12 months)'} height={360} type={type}/> : <LoadAnimation /> }
                </div>
                <div className='top-10-line-chart wrapper'>
                    {currData.length > 0 ? <LineChart height={400} type={type}/> : <LoadAnimation /> }
                </div>
                <div className='pareto wrapper'>
                    {currData.length > 0 ? <ParetoChart height={400} type={type}/> : <LoadAnimation />}
                </div>
                <div className='parts-table wrapper'>
                    {currData.length > 0 ? <PartsTable setBaseData={setBaseData} type={type}/> : <LoadAnimation />}
                </div>
            </div>
        </main>
     );
}
 
export default Dashboard;