import React, { useState, useEffect } from 'react';
import BarChart from '../BarChart/BarChart';
import SearchBar from '../SearchBar/SearchBar';
import SearchTable from '../SearchTable/SearchTable';
import './PartDashboard.css';

const PartDashboard = () => {

    const [partsList, setPartsList] = useState([{sku: '', name: ''}]);
    const [searchTerm, setSearchTerm] = useState('');
    const [partSelection, setPartSelection] = useState([]);

    const Check = (sku) => {
        const onChange = (e) =>{
            if (e.target.checked) {
                setPartSelection(prev => [...prev, sku])
            } else {
                setPartSelection(prev => prev.filter(element => element !== sku))
            }
        }
        return (
            <input type='checkbox' onChange={onChange}></input>
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

    console.log(partSelection);

    useEffect(() => {
        if (searchTerm !== '') {
            searchForParts(searchTerm)
        } else searchForParts('')
    }, [searchTerm]);

    return (
        <main>
            {/* need to add search bar that sets the part number - ensure that p/n is 6 chars long, api will have to handle invalid part numbers or parts with no data */}
            <div className="container">
                <div className='search wrapper'>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchForParts={searchForParts}/>
                    <SearchTable data={partsList}/>
                </div>
                <div className="trends wrapper">
                    {/* <BarChart /> */}
                </div>
                <div className="cumulative wrapper"></div>
                <div className="tables wrapper"></div>
                <div className="map wrapper"></div>
            </div>

        </main>
    );
}


export default PartDashboard;