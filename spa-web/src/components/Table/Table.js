import React from 'react';
import { useTable, useSortBy } from 'react-table';

const Table = ({ columns, data, sort, className }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    )
    const firstPageRows = rows.slice(0, 20)
    return (
        <>
            <table className={className} {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {sort ? <span style={{marginLeft: '8px'}}>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <i class="fa-solid fa-arrow-up"></i>
                                                : <i class="fa-solid fa-arrow-down"></i>
                                            : <i class="fa-solid fa-arrows-up-down"></i>}
                                    </span> : <></>}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
        </>
    );
}

export default Table;