import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';
import './PartsTable.css';
import InfiniteScroll from 'react-infinite-scroll-component';
// import "react-table/react-table.css";  

const PartsTable = ({setBaseData, type}) => {

    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0)

    const setInitialData = async (type) => {
        const response = await fetch(`http://localhost:5000/parts-table?offset=0&warranty=${type}`);
        const result = await response.json()
        setBaseData(result);
        setData(result)
        setOffset(10)
    }

    const getPartsTableData = async (type) => {
        const response = await fetch(`http://localhost:5000/parts-table?offset=${offset}&warranty=${type}`);
        const result = await response.json()
        // console.log(result);
        setData(prev => [...prev, ...result])
        setOffset(prev => prev + 10)
    }

    useEffect(() => {
        setInitialData(type)
        // setOffset(0)
    }, [type])

    // console.log(data);

    const columns = [{
        Header: 'SKU',
        accessor: 'sku'
    },
    {
        Header: 'Description',
        accessor: 'description'
    },
    type === 'Warranty' ? 
    {
        Header: 'Last Month Claims',
        accessor: 'lastMonth'
    } : {
        Header: 'Last Month Sales',
        accessor: 'lastMonth'
    },
    type === 'Warranty' ? 
    {
        Header: '12 Month Claims',
        accessor: 'yearClaims'
    } : {
        Header: '12 Month Sales',
        accessor: 'yearClaims'
    },
    ]
    return (
        <div className='table-wrapper'>
            <div id='scroll' className='scroll'>
                <InfiniteScroll
                    dataLength={data.length}
                    next={() => getPartsTableData(type)}
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