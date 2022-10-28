import React from 'react';
import { Link } from 'react-router-dom';
import './TitleBar.css';

const TitleBar = ({heading}) => {
    return ( 
        <div style={{position: 'relative'}}>
            <header>
                <h3>{heading}</h3>
            </header>
            <div className='heading-wrapper'>
                {/* <div className='header-bar'>
                    <h3>{heading}</h3>
                </div> */}
                <div className='logo-wrapper'>
                    <img className='logo-icon' src='https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/69000142100/original/updated%20FZ%20green%20124x124.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAS6FNSMY2XLZULJPI%2F20221027%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221027T175020Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=37fb4380cfa84f9326788e222c211dbf6072b2a6f047d0cf5e16c9e7bea47715' alt='Flowzone logo'/>

                </div>
                <nav>
                        <div className='nav-item'>
                            <Link to='/'><i className="fa-solid fa-list-ul fa-lg"></i></Link>
                        </div>
                        {/* <div className='nav-item'>
                            <Link to='/heatmap'><i className="fa-solid fa-fire-flame-simple fa-lg"></i></Link>
                        </div> */}
                        <div className='nav-item'>
                            <Link to='/parts'><i className="fa-solid fa-magnifying-glass fa-lg"></i></Link>
                        </div>
                </nav>
            </div>
        </div>
     );
}
 
export default TitleBar;