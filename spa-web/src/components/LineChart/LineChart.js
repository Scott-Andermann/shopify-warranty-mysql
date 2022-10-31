import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import LoadAnimation from '../LoadAnimation/LoadAnimation';
import './LineChart.css';

const LineChart = ({height, type}) => {
    const [data, setData] = useState([]);
    const [dates, setDates] = useState([]);
    const [offset, setOffset] = useState(0)

    const getLineData = async (update) => {
        console.log(offset + update);
        let offsetValue = offset + update;
        if (offsetValue < 0) offsetValue = 0;
        const response = await fetch(`http://localhost:5000/line-chart?offset=${offsetValue}&warranty=${type}`);
        const result = await response.json();
        // console.log(result);
        setDates(result['Dates']);
        setData(result['traces']);
        setOffset(offsetValue)
    } 
    
    const buildTrace = (trace) => {
        return trace[Object.keys(trace)[0]]
    }

    const setLegend = (trace) => {
        return Object.keys(trace)[0]
    }

    useEffect(() => {
        getLineData(0)
    }, [type])

    // console.log(data);
    // console.log(dates);
    // console.log(generateTraces(data));
    

    return ( 
        <div className='line chart'>
            {data.length > 0 && 
            <>
            <Plot
                data={data.map(trace => {return {type: 'line', y: buildTrace(trace), name: setLegend(trace)}})}
                layout={{autosize: true,
                    responsive: true,
                    title: type === 'Warranty' ? 'Top Claimed Parts': 'Most Sold Parts',   
                    xaxis: {
                        tickmode: "array",
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                        ticktext: dates
                        },
                        height: height,
                    showlegend: true }}
                  useResizeHandler= {true}
                  className='line-chart-plot'
            />
                <button className='paginate-button next' onClick={() => getLineData(10)}>Next 10</button>
                <button className='paginate-button previous' onClick={() => getLineData(-10)}>Previous 10</button>
            </>
            }
        </div>
     );
}
 
export default LineChart;