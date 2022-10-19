import { useEffect, useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from '../App/App';
import Dashboard from '../Dashboard/Dashboard';
import TitleBar from '../TitleBar/TitleBar';

const Main = () => {
    const [shouldUpdate, setShouldUpdate] = useState(false)

    const update = async () => {
        const response = await fetch('http://localhost:5000/fetch-data');
        const result = await response.json();
        console.log(result);
        setShouldUpdate(true)
    }

    useEffect(() => {
        update()
    }, []);

    return ( 
        <BrowserRouter>
            <TitleBar />

                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    {/* <Route path='/part' element={<Part />} /> */}
                </Routes>
        </BrowserRouter>

     );
}
 
export default Main;