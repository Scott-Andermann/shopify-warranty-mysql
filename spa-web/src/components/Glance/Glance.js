import React, { useState, useEffect } from 'react';
import PrevArrow from '../PrevArrow/PrevArrow';

const Glance = ({ partSelection, partsList, partData, salesData }) => {
    // const [ytd, setYtd] = useState({diff: 0, qty: 0});
    // const [warr, setWarr] = useState({diff: 0, qty: 0});

    // const getDiff = (data) => {
    //     const initial = 0;
    //     const currentYear = data.currentYear.reduce((prev, curr) => prev + curr, initial);
    //     const prevYear = data.previousYear.reduce((prev, curr) => prev + curr, initial);
    //     // console.log(currentYear - prevYear);

    //     return {curr: currentYear, prev: prevYear, qty: currentYear}
    // }

    const getCurrent = (data) => {
        const initial = 0;
        return data.currentYear.reduce((prev, curr) => prev + curr, initial);
    }

    const getPrevious = (data) => {
        const initial = 0;
        return data.previousYear.reduce((prev, curr) => prev + curr, initial);
    }


    // console.log(ytd);

    return (
        <>
            <div className='glance details'>
                <h2>Details</h2>
                <h4>Part Number: 
                    <p>
                    {partSelection.length > 0 && partSelection}
                    </p>
                </h4>
                <h4>Part Name: 
                    <p>{partSelection.length > 0 && partsList.filter(element => element.sku === partSelection)[0].part_name}</p>
                </h4>
            </div>
            <div className='glance glance-sales'>
                <h2>Monthly Sales</h2>
                {Object.keys(salesData).length > 0 &&
                    <>
                        <PrevArrow curr={salesData.currentYear[11]} prev={salesData.currentYear[10]} opposite={false} month={true} />
                        <h3>{salesData.currentYear[11]}</h3>
                    </>
                }
            </div>
            <div className='glance glance-ytd'>
                <h2>Yearly Sales</h2>
                {Object.keys(salesData).length > 0 &&
                    <>
                        <PrevArrow curr={getCurrent(salesData)} prev={getPrevious(salesData)} opposite={false} month={false} />
                        <h3>{getCurrent(salesData)}</h3>
                    </>
                }
            </div>
            <div className='glance glance-warranty'>
                <h2>Monthly Warranty</h2>
                {Object.keys(partData).length > 0 &&
                    <>
                        <PrevArrow curr={partData.currentYear[11]} prev={partData.currentYear[10]} opposite={true} month={true} />
                        <h3>{partData.currentYear[11]}</h3>
                    </>
                }
            </div>
            <div className='glance glance-ytd-warranty'>
                <h2>Yearly Warranty</h2>
                {Object.keys(partData).length > 0 &&
                    <>
                        <PrevArrow curr={getCurrent(partData)} prev={getPrevious(partData)} opposite={true} month={false} />
                        <h3>{getCurrent(partData)}</h3>
                    </>
                }
            </div>
        </>
    );
}

export default Glance;