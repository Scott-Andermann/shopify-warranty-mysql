import React, { useState, useEffect } from 'react';
import Table from './Table'; 
// import "react-table/react-table.css";  

const PartsTable = () => {

    const [data, setData] = useState([]);

    const getPartsTableData = async () => {
        const response = await fetch('http://localhost:5000/parts-table');
        const result = await response.json()
        setData(result)
    } 

    useEffect(() => {
        getPartsTableData()
    }, [])



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
          <div>  
              {data.length > 0 && <Table  
                  data={data}  
                  columns={columns}  
                  defaultPageSize = {2}  
                  pageSizeOptions = {[2,4, 6]}  
              />  
              }
          </div>        
    )  
}

export default PartsTable;