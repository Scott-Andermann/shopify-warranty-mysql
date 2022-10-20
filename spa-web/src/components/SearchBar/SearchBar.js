import React, {useEffect} from 'react';
import './SearchBar.css';

const SearchBar = ({searchTerm, setSearchTerm, searchForParts}) => {

    const onChangeHandler = (e) => {
        // debounce typing
        setTimeout(() => {
            setSearchTerm(e.target.value)
        }, 2000)

    }

    return ( 
        <div className='search-bar-wrapper'>
            <span className='search-icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="app-icon app-icon--smallsecondary modal-search-icon" data-identifyElement="140"><path fill="#000000" d="M11.015 11.95c-2.641 2.17-6.557 2.013-9.033-.464-2.635-2.635-2.644-6.898-.019-9.523s6.888-2.616 9.523.019c2.477 2.476 2.633 6.392.464 9.033l3.855 3.855c.26.26.26.679.002.937a.662.662 0 01-.937-.002l-3.855-3.855zM2.902 2.902C.793 5.01.8 8.435 2.917 10.552c2.116 2.116 5.541 2.123 7.65.015 2.108-2.109 2.101-5.534-.015-7.65C8.435.8 5.01.793 2.902 2.902z" data-identifyElement="141"></path></svg>
            </span>
            <input className='search-bar' onChange={onChangeHandler} placeholder='Search'></input>
        </div>
     );
}
 
export default SearchBar;