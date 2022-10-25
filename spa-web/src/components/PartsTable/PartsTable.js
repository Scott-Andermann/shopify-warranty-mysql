import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';
import './PartsTable.css';
import InfiniteScroll from 'react-infinite-scroll-component';
// import "react-table/react-table.css";  

const PartsTable = () => {

    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0)

    const getPartsTableData = async () => {
        const response = await fetch(`http://localhost:5000/parts-table?offset=${offset}`);
        const result = await response.json()
        setData(prev => [...prev, ...result])
        setOffset(prev => prev + 10)
    }

    useEffect(() => {
        getPartsTableData()
    }, [])

    // console.log(data);

    const columns = [{
        Header: 'SKU',
        accessor: 'sku'
    },
    {
        Header: 'Description',
        accessor: 'description'
    },
    {
        Header: 'Last Month Claims',
        accessor: 'lastMonth'
    },
    {
        Header: '12 Month Claims',
        accessor: 'yearClaims'
    },
    ]
    return (
        <div className='table-wrapper'>
            <div id='scroll' className='scroll'>
                <InfiniteScroll
                    dataLength={data.length}
                    next={getPartsTableData}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scroll"
                >

                    {data.length > 0 && <Table
                        data={data}
                        columns={columns}
                        sort={true}
                        className='parts-table'
                    />
                    }
                </InfiniteScroll>
                {/* <button onClick={getPartsTableData}>Load more</button> */}
            </div>
        </div>
    )
}

export default PartsTable;