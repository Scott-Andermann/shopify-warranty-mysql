import React, { useState, useEffect } from 'react';
import BarChart from '../BarChart/BarChart';
import SearchBar from '../SearchBar/SearchBar';
import SearchTable from '../SearchTable/SearchTable';
import Glance from '../Glance/Glance';
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

    return (
        <main>
            {/* need to add search bar that sets the part number - ensure that p/n is 6 chars long, api will have to handle invalid part numbers or parts with no data */}
            <div className="container">
                <Glance partSelection={partSelection} partsList={partsList} partData={partData} salesData={salesData}/>
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