import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import './LineChart.css';

const LineChart = () => {
    const [data, setData] = useState([]);
    const [dates, setDates] = useState([]);

    const getLineData = async () => {
        const response = await fetch('http://localhost:5000/line-chart');
        const result = await response.json();
        // console.log(result);
        setDates(result['Dates']);
        setData(result['traces']);
    } 
    
    const buildTrace = (trace) => {
        return trace[Object.keys(trace)[0]]
    }

    const setLegend = (trace) => {
        return Object.keys(trace)[0]
    }

    useEffect(() => {
        getLineData()
    }, [])

    // console.log(data);
    // console.log(dates);
    // console.log(generateTraces(data));
    

    return ( 
        <div className='line-chart'>
            {data.length > 0 && <Plot
                data={data.map(trace => {return {type: 'line', y: buildTrace(trace), name: setLegend(trace)}})}
                layout={{autosize: true,
                    responsive: true,
                    title: 'Top Claimed Parts',   
                    xaxis: {
                        tickmode: "array",
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                        ticktext: dates
                        },
                    showlegend: true }}
                  useResizeHandler= {true}
                  className='line-chart-plot'
            />}
        </div>
     );
}
 
export default LineChart;