import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
// import './LineChart.css';

const LineChart = () => {
    const [data, setData] = useState({});
    const [dates, setDates] = useState([]);
    const [traces, setTraces] = useState([]);

    const omit = (obj, ...props) => {
        const result = {...obj};
        props.forEach(function(prop) {
            delete result[prop];
        });
        return result;
    }

    const generateTraces = (obj) => {
        const keys = Object.keys(obj)
        const temp_traces = []
        for (let key of keys) {
            temp_traces.push(obj[key])
        }
        setTraces(temp_traces)
    }

    const getLineData = async () => {
        const response = await fetch('http://localhost:5000/line-chart');
        const result = await response.json();
        const {bar, ...foo} = result
        setDates(result['Dates']);
        setData(omit(result, 'Dates'));
    } 
    
    useEffect(() => {
        getLineData()
    }, [])

    useEffect(() => {
        generateTraces(data)
    }, [data]);
    
    console.log(data);
    // console.log(dates);
    // console.log(generateTraces(data));
    

    return ( 
        <div className='pareto-chart'>
            {traces.length > 0 && <Plot
                data={traces.map(trace => {return {type: 'line', y: trace}})}
                layout={{autosize: true,
                    responsive: true,
                    title: 'Previous Month Top Claims',   
                    // xaxis: {
                    //     tickmode: "array",
                    //     tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                    //     ticktext: skus
                    //     },
                    yaxis2: {
                        overlaying: 'y',
                        side: 'right'
                        },
                    showlegend: false }}
                  useResizeHandler= {true}
                  className='pareto-chart-plot'
            />}
        </div>
     );
}
 
export default LineChart;