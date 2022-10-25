import React from 'react';
import './PrevArrow.css';


const PrevArrow = ({curr, prev, opposite, month}) => {
    if (curr < prev) {
        return ( 
            <div>
                <h4><span className={opposite ? 'positive' : 'negative'}><i className="fa-solid fa-arrow-down" /> {prev - curr}</span> Less than last {month ? "month": 'year'}</h4>
            </div>
         ) ;

    } else if (curr === prev) {
        return (
            <div>
                <h4>No change from last {month ? "month": 'year'}</h4>
            </div>
        )
    } else {
        return ( 
            <div>
                <h4><span className={opposite ? 'negative' : 'positive'}><i className="fa-solid fa-arrow-up" /> {curr - prev}</span> More than last {month ? "month": 'year'}</h4>
            </div>
         ) ;
    }

}
 
export default PrevArrow;   