import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import './BarChart.css';

const BarChart = () => {

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

    // console.log(currData);

    return ( 
        <div className='bar chart'>
            <Plot
                data={[
                    {type: 'bar', y: prevData, name: 'Previous Year'},
                    {type: 'bar', y: currData, name: 'Curent Year'}
                  ]}
                layout={{autosize: true, 
                    responsive: true,
                    title: 'Total Claims (rolling 12 months)',   
                    xaxis: {
                        tickmode: "array",
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        ticktext: dates
                    }}}
                useResizeHandler= {true}
                className='bar-chart-plot'
            />
        </div>
     );
}
 
export default BarChart;