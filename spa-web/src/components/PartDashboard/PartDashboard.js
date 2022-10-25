import React, { useState, useEffect } from 'react';
import BarChart from '../BarChart/BarChart';
import SearchBar from '../SearchBar/SearchBar';
import SearchTable from '../SearchTable/SearchTable';
import './PartDashboard.css';

const PartDashboard = () => {

    const [partsList, setPartsList] = useState([{sku: '', name: ''}]);
    const [searchTerm, setSearchTerm] = useState('');
    const [partSelection, setPartSelection] = useState([]);
    const [dates, setDates] = useState([]);
    const [partData, setPartData] = useState({});
    const [salesData, setSalesData] = useState({});

    const Check = (sku) => {
        const onChange = (e) =>{
            if (e.target.checked) {
                setPartSelection(sku)
        }}
        return (
            <input type='radio' onChange={onChange} name='parts'></input>
        )
    }

    const searchForParts = async (term) => {
        if (term === '') {
            setPartsList([{sku: '', name: ''}]);
        } else {
            const response = await fetch(`http://localhost:5000/search-term?term=${term}`);
            const result = await response.json()
            // console.log(result);
            setPartsList(result.map(element => {return {check: Check(element[0]), sku: element[0], part_name: element[1]}}));
        }
    }

    const getPartData = async () => {
        const response = await fetch(`http://localhost:5000/bar-chart?skus=${partSelection.toString()}`);
        const result = await response.json();
        // console.log(result);
        setPartData(result[Object.keys(result)[0]]);
        setDates(result[Object.keys(result)[0]].dates);
    }

    const getSalesData = async () => {
        const response = await fetch(`http://localhost:5000/sales?skus=${partSelection.toString()}`)
        const result = await response.json();
        setSalesData(result[Object.keys(result)[0]]);
    }

    const getName = () => {
        const partName = partsList.filter(element => element.sku === partSelection)[0].part_name
        console.log(partName);
    }

    useEffect(() => {
        getPartData();
        getSalesData();
        // getName();
    }, [partSelection]);

    useEffect(() => {
        setPartSelection([]);

        if (searchTerm !== '') {
            searchForParts(searchTerm)
        } else searchForParts('')
    }, [searchTerm]);

    console.log(partsList);

    return (
        <main>
            {/* need to add search bar that sets the part number - ensure that p/n is 6 chars long, api will have to handle invalid part numbers or parts with no data */}
            <div className="container">
                <div className='glance details'>
                    <h2>Details</h2>
                    <h3>Part Number: {partSelection.length > 0 ? partSelection : ''}</h3>
                    <h3>Part Name: {partSelection.length > 0 ? partsList.filter(element => element.sku === partSelection)[0].part_name : ''}</h3>
                </div>
                <div className='glance glance-sales'>
                    <h2>Monthly Sales</h2>
                    <h4>greater than or less than last month</h4>
                </div>
                <div className='glance glance-ytd'>
                    <h2>Yearly Sales</h2>
                    <h4>greater than or less than last month</h4>
                </div>
                <div className='glance glance-warranty'>
                    <h2>Monthly Warranty</h2>
                    <h4>greater than or less than last month</h4>
                </div>
                <div className='glance glance-ytd-warranty'>
                    <h2>Yearly Warranty</h2>
                    <h4>greater than or less than last month</h4>
                </div>
                <div className='search wrapper'>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchForParts={searchForParts}/>
                    <SearchTable data={partsList}/>
                </div>
                <div className="trends wrapper">
                    <BarChart dates={dates} prevData={partData.previousYear} currData={partData.currentYear} title={`YoY Warranty - ${partSelection.toString()}`} />
                </div>
                <div className="cumulative wrapper">
                    <BarChart dates={dates} prevData={salesData.previousYear} currData={salesData.currentYear} title={`YoY Online Sales - ${partSelection.toString()}`} />
                </div>
                <div className="tables wrapper"></div>
                <div className="map wrapper"></div>
            </div>

        </main>
    );
}


export default PartDashboard;