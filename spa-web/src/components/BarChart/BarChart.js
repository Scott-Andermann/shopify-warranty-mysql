import React from 'react';
import Plot from 'react-plotly.js';
import './BarChart.css';

const BarChart = ({dates, prevData, currData, title, height = 450}) => {
    return ( 
        <div className='bar chart'>
            <Plot
                data={[
                    {type: 'bar', y: prevData, name: 'Previous Year'},
                    {type: 'bar', y: currData, name: 'Current Year'}
                  ]}
                layout={{autosize: true, 
                    responsive: true,
                    height:height,
                    title: title,   
                    xaxis: {
                        tickmode: "array",
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                        ticktext: dates
                    }}}
                useResizeHandler= {true}
                className='bar-chart-plot'
            />
            <div className='blur' style={{height: '6rem'}}></div>
        </div>
     );
}
 
export default BarChart;