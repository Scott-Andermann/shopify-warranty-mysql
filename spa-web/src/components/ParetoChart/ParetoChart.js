import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import './ParetoChart.css';

const ParetoChart = () => {
    const [claims, setClaims] = useState([]);
    const [skus, setSkus] = useState([]);
    const [freq, setFreq] = useState([]);

    const getParetoData = async () => {
        const response = await fetch('http://localhost:5000/pareto-chart');
        const result = await response.json();
        setClaims(result['claims']);
        setSkus(result['skus']);
        setFreq(result['frequency']);
    } 

    useEffect(() => {
        getParetoData()
    }, [])
    

    return ( 
        <div className='pareto chart'>
            <Plot
                data={[
                    {type: 'bar', y: claims},
                    {type: 'line', y: freq, yaxis: 'y2'}
                  ]}
                layout={{autosize: true,
                    responsive: true,
                    title: 'Previous Month Top Claims',   
                    xaxis: {
                        tickmode: "array",
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                        ticktext: skus
                        },
                    yaxis2: {
                        overlaying: 'y',
                        side: 'right'
                        },
                    showlegend: false }}
                  useResizeHandler= {true}
                  className='pareto-chart-plot'
            />
        </div>
     );
}
 
export default ParetoChart;