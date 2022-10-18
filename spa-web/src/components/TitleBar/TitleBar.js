import React from 'react';
import { Link } from 'react-router-dom';
import './TitleBar.css';

const TitleBar = () => {
    return ( 
        <div className='heading-wrapper'>
            <h1>WESSOL WARRANTY WIDGET</h1>
            <nav>
                <ul>
                    <li className='nav-item'>
                        <Link to='/'>Dashboard</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/heatmap'>Heatmap</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/parts'>Parts</Link>
                    </li>
                </ul>
            </nav>
        </div>
     );
}
 
export default TitleBar;