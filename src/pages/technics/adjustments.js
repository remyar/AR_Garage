import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import { withNavigation } from '../../providers/navigation';
import { useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Loader from '../../components/Loader';
import SearchComponent from '../../components/Search';
import actions from '../../actions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingTop: "5px",
        paddingBottom: "5px"
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function TechnicsAdjustmentsPage(props) {

    let params = useParams();
    params.motorId = parseInt(params.motorId);

    const [displayLoader, setDisplayLoader] = useState(false);
    const [adjustments, setAdjustments] = useState([]);
    const [adjustmentsHeaders, setAdjustmentsHeaders] = useState([]);
    const [adjustmentsSentences, setAdjustmentsSentences] = useState([]);
    const [filter, setFilter] = useState("");

    async function fetchData() {
        try {
            setDisplayLoader(true);
            let result = await props.dispatch(actions.technics.getAdjustmentsByTypeId(params.motorId));
            setAdjustments(result.adjustments);
            result = await props.dispatch(actions.technics.getAdjustmentsHeaders());
            setAdjustmentsHeaders(result.adjustementsHeaders);
            result = await props.dispatch(actions.technics.getAdjustmentsSentences());
            setAdjustmentsSentences(result.adjustementsSentences);
            setDisplayLoader(false);
        } catch (err) {
            props.snackbar.error('fetch.error');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    let main_groups = [];

    adjustments?.forEach(element => {
        if (main_groups.find((e) => e?.adj_header_id == element.adj_header_id) == undefined) {
            main_groups.push(adjustmentsHeaders.find((e) => e?.adj_header_id == element.adj_header_id));
        }
    });

    return <Box sx={{ paddingBottom: '25px' }}>

        <Loader display={displayLoader} />

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <br />
        <br />
        <Box sx={{ height: (window.innerHeight - 210) + "px", overflowX: "scroll", paddingBottom: "2px" }}>

            {(displayLoader == false) && main_groups.map((main_group, idx) => {
                let elements = [...adjustments.filter((e) => e.adj_header_id == main_group.adj_header_id)];

                elements = elements.map((e) => {
                    if (e.parent_id == null && (e.value || "").trim().length != 0) {
                        return e;
                    } else if (e.parent_id) {
                        let parent_sentence = adjustmentsSentences.find((_e) => _e.sentence_id == e.parent_id);
                        let sentence = adjustmentsSentences.find((_e) => _e.sentence_id == e.sentence_id);

                        e.value = sentence.sent_text + ((e.value?.trim().length > 0) ? " :" : "") + " " + e.value + " " + (sentence.sent_meas_units || "");
                        e.sentence_id = parent_sentence.sentence_id;
                        e.parent_id = null;
                        return e;
                    }
                }).filter((e) => e != undefined);

                return <Box sx={{ paddingTop: ((idx == 0) ? "" : "15px") }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>{main_group.header_text}</StyledTableCell>
                                    <StyledTableCell></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {elements.map((element, idx) => {
                                    let sentence = adjustmentsSentences?.find((e) => e.sentence_id == element.sentence_id);
                                    let title = sentence?.sent_text || "";
                                    let value = element?.value + " " + (sentence?.sent_meas_units || "");
                                    if (filter.length > 0) {
                                        if (title?.trim().toLowerCase().includes(filter.toLocaleLowerCase()) == false ){
                                            return
                                        }
                                    } 
                                    return <StyledTableRow key={'_libraire_component_' + idx}>
                                        <StyledTableCell>{title + " :"} </StyledTableCell>
                                        <StyledTableCell sx={{ textAlign: "right" }}>{value?.trim()}</StyledTableCell>
                                    </StyledTableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            })}

        </Box>
    </Box>
}

export default withNavigation(withSnackBar(withStoreProvider(injectIntl(TechnicsAdjustmentsPage))));