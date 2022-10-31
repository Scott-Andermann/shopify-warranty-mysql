import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import './ParetoChart.css';

const ParetoChart = ({height, type}) => {
    const [claims, setClaims] = useState([]);
    const [skus, setSkus] = useState([]);
    const [freq, setFreq] = useState([]);

    const getPrevMonth = () => {
        const date = new Date();
        const prevDate = new Date(date.getFullYear(), date.getMonth() - 1, 1)
        return prevDate.toLocaleString('default', {month: 'long'})
    }

    const getParetoData = async (type) => {
        const response = await fetch(`http://localhost:5000/pareto-chart?warranty=${type}`);
        const result = await response.json();
        setClaims(result['claims']);
        setSkus(result['skus']);
        setFreq(result['frequency']);
    } 

    useEffect(() => {
        getParetoData(type)
    }, [type])
    

    return ( 
        <div className='pareto chart'>
            <Plot
                data={[
                    {type: 'bar', y: claims},
                    {type: 'line', y: freq, yaxis: 'y2'}
                  ]}
                layout={{autosize: true,
                    responsive: true,
                    title: type === 'Warranty' ? `${getPrevMonth()} Top Claims` : `${getPrevMonth()} Top Selling Parts`,   
                    xaxis: {
                        tickmode: "array",
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                        ticktext: skus
                        },
                    yaxis2: {
                        overlaying: 'y',
                        side: 'right'
                        },
                    showlegend: false,
                    height: height
                 }}
                  useResizeHandler= {true}
                  className='pareto-chart-plot'
            />
        </div>
     );
}
 
export default ParetoChart;