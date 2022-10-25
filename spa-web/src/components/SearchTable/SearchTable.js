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
    return (
        <div className='search-table-wrapper'>
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