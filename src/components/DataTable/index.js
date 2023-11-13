import React, { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.focus,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '.MuiTableRow-hover': {
        backgroundColor: theme.palette.action.active
    }
}));

function DataTable(props) {

    let headers = props.headers || [];
    let rows = props.rows || [];
    let sx = { ...props.sx }

    return <TableContainer component={Paper} sx={{ minHeight: sx.height, maxHeight: sx.height }}>
        <Table sx={{ minWidth: '100%' }} aria-label="simple table" stickyHeader >
            <TableHead>
                <TableRow>
                    {headers.map((header) => (
                        <StyledTableCell
                            key={header.id == undefined ? new Date().getTime() : header.id}
                            align={header.align}
                            style={{ minWidth: header.minWidth }}
                        >
                            {header.label}
                        </StyledTableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, rowIdx) => {
                    if ((row.isCustom == undefined || row.isCustom == false)) {
                        return <TableRow onClick={(event) => {
                            row.onClick && row.onClick(row, rowIdx, event);
                        }} sx={{ ...row.sx }} hover key={"row_" + rowIdx}>
                            {headers.map((header, headerIdx) => {
                                return <TableCell key={"cell_" + rowIdx + "_" + headerIdx} align={header.align}>
                                    {(() => {
                                        let value = header.id ? row[header.id] : '';
                                        if (header.render) {
                                            value = header.render(row);
                                        }
                                        return value;
                                    })()}
                                </TableCell>
                            })}
                        </TableRow>
                    }
                    else if (row.isCustom == true) {
                        return row.render && row.render();
                    }
                })}
            </TableBody>
        </Table>
    </TableContainer>

    /*
    return <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: "25px" }}>
        <TableContainer sx={{ ...sx}}>
            <Table stickyHeader aria-label="sticky table" >
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <StyledTableCell
                                key={header.id == undefined ? new Date().getTime() : header.id}
                                align={header.align}
                                style={{ minWidth: header.minWidth }}
                            >
                                {header.label}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, rowIdx) => {
                        if ((row.isCustom == undefined || row.isCustom == false)) {
                            return <TableRow onClick={(event) => {
                                row.onClick && row.onClick(row, rowIdx, event);
                            }} sx={{ ...row.sx }} hover key={"row_" + rowIdx}>
                                {headers.map((header, headerIdx) => {
                                    return <TableCell key={"cell_" + rowIdx + "_" + headerIdx} align={header.align}>
                                        {(() => {
                                            let value = header.id ? row[header.id] : '';
                                            if (header.render) {
                                                value = header.render(row);
                                            }
                                            return value;
                                        })()}
                                    </TableCell>
                                })}
                            </TableRow>
                        }
                        else if (row.isCustom == true) {
                            return row.render && row.render();
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
*/
    /*
    return <Paper sx={{ ...sx, width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ ...sx, marginTop: "0px", overflow: 'hidden' }}>
            <Table sx={{ heigth:'100%'}} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <StyledTableCell
                                key={header.id == undefined ? new Date().getTime() : header.id}
                                align={header.align}
                                style={{ minWidth: header.minWidth }}
                            >
                                {header.label}
                            </StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody >
                    {rows.map((row, rowIdx) => {
                        if ((row.isCustom == undefined || row.isCustom == false)) {
                            return <TableRow onClick={(event) => {
                                row.onClick && row.onClick(row, rowIdx, event);
                            }} sx={{ ...row.sx }} hover key={"row_" + rowIdx}>
                                {headers.map((header, headerIdx) => {
                                    return <TableCell key={"cell_" + rowIdx + "_" + headerIdx} align={header.align}>
                                        {(() => {
                                            let value = header.id ? row[header.id] : '';
                                            if (header.render) {
                                                value = header.render(row);
                                            }
                                            return value;
                                        })()}
                                    </TableCell>
                                })}
                            </TableRow>
                        }
                        else if (row.isCustom == true) {
                            return row.render && row.render();
                        }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>
    */
}

export default DataTable