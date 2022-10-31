import React, { useState, useEffect } from 'react';
import BarChart from '../BarChart/BarChart';
import SearchBar from '../SearchBar/SearchBar';
import SearchTable from '../SearchTable/SearchTable';
import Glance from '../Glance/Glance';
import Map from '../Map/Map';
import './PartDashboard.css';
import LoadAnimation from '../LoadAnimation/LoadAnimation';

const PartDashboard = ({baseData, setHeading}) => {

    const reformatBaseData = () => {
        const updatedData = baseData.map(element => {return {check: Check(element.sku), sku: element.sku, part_name: element.description}})

        return updatedData
    }
    const Check = (sku) => {
        const onChange = (e) =>{
            if (e.target.checked) {
                // console.log('setting part selection', sku);
                setPartSelection(prev => [...prev, sku])
        } else {
            setPartSelection(prev => prev.filter(element => element !== sku))
        }
    }
        return (
            <input type='checkbox' onChange={onChange} name='parts' value={sku} key={sku}></input>
        )
    }

    const [partsList, setPartsList] = useState(reformatBaseData());
    const [searchTerm, setSearchTerm] = useState('');
    const [partSelection, setPartSelection] = useState([]);
    const [dates, setDates] = useState([]);
    const [partData, setPartData] = useState({});
    const [salesData, setSalesData] = useState({});
    const [mapData, setMapData] = useState({});
    const [warranty, setWarranty] = useState(false);



    const searchForParts = async (term) => {
        if (term === '') {
            setPartsList(reformatBaseData());
        } else {
            const response = await fetch(`http://localhost:5000/search-term?term=${term}`);
            const result = await response.json()
            // console.log(result);
            setPartsList(result.map(element => {return {check: Check(element[0]), sku: element[0], part_name: element[1]}}));
        }
    }

    const combineData = (resultObj) => {
        let currentYear = [0,0,0,0,0,0,0,0,0,0,0,0];
        let previousYear = [0,0,0,0,0,0,0,0,0,0,0,0];
        for (let item in resultObj) {
            for (let i = 0; i < resultObj[item]['currentYear'].length; i++) {
                currentYear[i] = currentYear[i] + resultObj[item]['currentYear'][i]
                previousYear[i] = previousYear[i] + resultObj[item]['previousYear'][i]
            }
        }
        return {currentYear: currentYear, previousYear: previousYear}
    }

    const getPartData = async () => {
        const response = await fetch(`http://localhost:5000/bar-chart?skus=${partSelection.toString()}&warranty=Warranty`);
        const result = await response.json();
        // console.log(result);
        // combineData(result)
        setPartData(combineData(result));
        setDates(result[Object.keys(result)[0]].dates);
    }

    const getSalesData = async () => {
        const response = await fetch(`http://localhost:5000/sales?skus=${partSelection.toString()}`)
        const result = await response.json();
        setSalesData(combineData(result));
    }

    const getMapData = async () => {
        const response = await fetch(`http://localhost:5000/heatmap?skus=${partSelection.toString()}&warranty=${false}`)
        const result = await response.json();
        // console.log(result);
        setMapData(result);
    }

    useEffect(() => {
        if (partSelection.length !== 0) {
            getPartData();
            getSalesData();
            getMapData();
        } else {
            setPartData([]);
            setSalesData([]);
            setMapData({});
        }
        // getName();
    }, [partSelection]);

    useEffect(() => {
        setPartSelection([]);
        
        // setPartsList(reformatBaseData())

        if (searchTerm !== '') {
            searchForParts(searchTerm)
        } else {
            searchForParts('');
            setPartData([]);
            setSalesData([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        setHeading('Part Explorer');
    }, []);

    // console.log('parts', partsList);
    // console.log('base dat', baseData);
    // console.log(partData);

    console.log(dates);

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
                    {dates.length > 0 && partSelection.length > 0 ? <BarChart dates={dates} prevData={partData.previousYear} currData={partData.currentYear} title={`YoY Warranty - ${partSelection.toString()}`} height={360} /> :  partSelection.length > 0 ? <LoadAnimation /> : <></>}
                </div>
                <div className="cumulative wrapper">
                    {dates.length > 0 && partSelection.length ? <BarChart dates={dates} prevData={salesData.previousYear} currData={salesData.currentYear} title={`YoY Online Sales - ${partSelection.toString()}`} height={360} /> : partSelection.length > 0 ? <LoadAnimation /> : <></>}
                </div>
                <div className="tables wrapper">
                    {/* <LoadAnimation /> */}
                </div>
                <div className="map wrapper">
                    {mapData.length > 0 && partSelection.length > 0 ?
                        <div id='map'>
                            <Map data={mapData} warranty={warranty}/>
                        </div> : partSelection.length > 0 ? <LoadAnimation /> : <></>
                    }
                </div>
            </div>

        </main>
    );
}


export default PartDashboard;