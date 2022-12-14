import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';
import './SearchTable.css';

const SearchTable = ({data}) => {
    
    const columns = [
    {
        Header: '',
        accessor: 'check'
    },
        {
        Header: 'SKU',
        accessor: 'sku'
    },
    {
        Header: 'Description',
        accessor: 'part_name'
    }
    ]
    
    if (data.length === 0) {
        data = [{check: '', sku: '', part_name: 'No results found'}]
    }

    return (
        <div className='search-table-wrapper'>
            <div className='blur' style={{marginTop: '4rem'}}></div>
            <div id='scroll' className='scroll'>
                    {data.length > 0 && <Table
                        data={data}
                        columns={columns}
                        sort={false}
                        className='search-table'
                    />
                    }
                {/* <button onClick={getPartsTableData}>Load more</button> */}
            </div>
        </div>
    )
}

export default SearchTable;