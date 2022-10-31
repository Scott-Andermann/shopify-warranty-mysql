import { useEffect, useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from '../App/App';
import Dashboard from '../Dashboard/Dashboard';
import PartDashboard from '../PartDashboard/PartDashboard';
import TitleBar from '../TitleBar/TitleBar';

const Main = () => {
    const [baseData, setBaseData] = useState([]);
    const [heading, setHeading] = useState('');

    const update = async () => {
        const response = await fetch('http://localhost:5000/fetch-data');
        const result = await response.json();
        console.log(result);
    }

    useEffect(() => {
        update()
    }, []);

    console.log(baseData);

    return ( 
        <BrowserRouter>
            <TitleBar heading={heading}/>
            <Routes>
                <Route path='/' element={<Dashboard setBaseData={setBaseData} setHeading={setHeading} type='Sales'/>} />
                <Route path='/warranty' element={<Dashboard setBaseData={setBaseData} setHeading={setHeading} type='Warranty'/>} />
                <Route path='/parts' element={<PartDashboard baseData={baseData} setHeading={setHeading}/>} />
                {/* <Route path='/part' element={<Part />} /> */}
            </Routes>
        </BrowserRouter>

     );
}
 
export default Main;