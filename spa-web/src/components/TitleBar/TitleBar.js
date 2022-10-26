import React from 'react';
import { Link } from 'react-router-dom';
import './TitleBar.css';

const TitleBar = () => {
    return ( 
        <div className='heading-wrapper'>
            <nav>
                <ul>
                    <li className='nav-item'>
                        <Link to='/'><i class="fa-solid fa-list-ul"></i> Dashboard</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/heatmap'><i class="fa-solid fa-fire-flame-simple"></i> Heatmap</Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/parts'>Parts</Link>
                    </li>
                </ul>
            </nav>
            <h1>WESSOL WARRANTY WIDGET</h1>
        </div>
     );
}
 
export default TitleBar;