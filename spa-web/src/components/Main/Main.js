import {BrowserRouter, Route, Routes} from 'react-router-dom';
import App from '../App/App';
import Dashboard from '../Dashboard/Dashboard';
import TitleBar from '../TitleBar/TitleBar';

const Main = () => {
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