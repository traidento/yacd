import React from 'react';
import { ArrowUp, ArrowDown } from 'react-feather';
import prettyBytes from '../misc/pretty-bytes';
import { formatDistance } from 'date-fns';
import cx from 'classnames';
import { useTable, useSortBy } from 'react-table';

import s from './ConnectionTable.module.css';

const columns = [
  { Header: 'Host', accessor: 'host' },
  { Header: 'Download', accessor: 'download' },
  { Header: 'Upload', accessor: 'upload' },
  { Header: 'Network', accessor: 'network' },
  { Header: 'Type', accessor: 'type' },
  { Header: 'Chains', accessor: 'chains' },
  { Header: 'Rule', accessor: 'rule' },
  { Header: 'Time', accessor: 'start' },
  { Header: 'Source IP', accessor: 'sourceIP' },
  { Header: 'Source Port', accessor: 'sourcePort' },
  { Header: 'Designation IP', accessor: 'destinationIP' },
  { Header: 'Designation Port', accessor: 'destinationPort' }
];

function renderCell(cell, now) {
  switch (cell.column.id) {
    case 'start':
      return formatDistance(-cell.value, now);
    case 'download':
    case 'upload':
      return prettyBytes(cell.value);
    default:
      return cell.value;
  }
}

function Table({ data }) {
  const now = new Date();
  const {
    getTableProps,
    // getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );
  return (
    <div {...getTableProps()}>
      <div className={s.thead}>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className={s.tr}>
            {headerGroup.headers.map(column => (
              <div
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={s.th}
              >
                <span>{column.render('Header')}</span>
                <span>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <ArrowDown size={16} />
                    ) : (
                      <ArrowUp size={16} />
                    )
                  ) : null}
                </span>
              </div>
            ))}

            {rows.map((row, i) => {
              prepareRow(row);
              return row.cells.map((cell, j) => {
                return (
                  <div
                    {...cell.getCellProps()}
                    className={cx(
                      s.td,
                      i % 2 === 0 ? s.odd : false,
                      j === 1 || j === 2 ? s.du : false
                    )}
                  >
                    {renderCell(cell, now)}
                  </div>
                );
              });
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Table;
