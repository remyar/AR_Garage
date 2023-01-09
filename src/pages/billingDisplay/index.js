import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import { useParams } from "react-router-dom";

import actions from '../../actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import Loader from '../../components/Loader';
import DatePicker from '../../components/DatePicker';
import DataTable from '../../components/DataTable';
import PrintIcon from '@mui/icons-material/Print';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';


function BillingsDisplayPage(props) {

    let params = useParams();

    const intl = props.intl;
    const facture_number = params?.facture_number ? params?.facture_number : 0;

    const [facture, setFacture] = useState({});
    const [displayLoader, setDisplayLoader] = useState(true);

    async function fetchData() {
        try {
            let result = await props.dispatch(actions.get.factureFromNumber(facture_number));
            setFacture(result.facture);
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        } finally {
            setDisplayLoader(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const headers = [
        { id: 'ref_fab', label: 'Code', minWidth: 100 },
        { id: 'name', label: 'Désignation', minWidth: 100 },
        // { id: 'info', label: 'Information', minWidth: 100 },
        { id: 'qty', label: 'Quantité', minWidth: 100 },
        // { id: 'tarif_achat', label: 'Tarif Achat', minWidth: 100 },
        { id: 'tarif_vente', label: 'Tarif Unitaire', minWidth: 100 },
        { id: 'tarif_total', label: 'Total TTC', minWidth: 100 },
    ];

    let devis_total = 0.0;
    let rows = facture?.products?.map((line) => {
        if (line.ref) {
            line.ref_fab = line.ref;
        }
        let tarif_total = parseFloat(line.quantity.toString()) * parseFloat(line.prix_vente.toString());
        devis_total += tarif_total;
        let tarif_vente = parseFloat(line.prix_vente.toString()).toFixed(2) + ' €';
        return { ...line, name: ((line.brand ? line.brand : '') + ' ' + (line.name ? line.name : line.commentaire ? line.commentaire : ' ')).trim(), info: '', qty: line.quantity, tarif_vente, tarif_total: tarif_total.toFixed(2) + ' €' };
    });

    rows && rows.push({
        isCustom: true, render: (row) => {
            return <TableRow  >
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                    <b>Total TTC :</b>
                </TableCell>
                <TableCell>
                    <b>{devis_total.toFixed(2) + ' €'}</b>
                </TableCell>
            </TableRow  >
        }
    });

    return <Box sx={{ paddingBottom: '25px' }}>
        <Loader display={displayLoader} />

        {facture?.facture_number && <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom component="div"><b>{intl.formatMessage({ id: 'billing.number' }) + " " + facture?.facture_number}</b></Typography>
            </Grid>
        </Grid>}

        {facture?.facture_number && <Grid container spacing={2} sx={{ paddingTop: '25px' }}>
            <Grid item xs={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Client" disabled variant="outlined" sx={{ width: "100%", textAlign: "center" }} value={facture?.client?.nom?.toUpperCase() + ' ' + facture?.client?.prenom} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField disabled label="Adresse" variant="outlined" sx={{ width: "100%", textAlign: "left" }} multiline maxRows='3' minRows='3'
                            value={(facture?.client?.adresse1 || "" + (facture?.client?.adresse2?.length ? ('\n' + facture?.client?.adresse2 + '\n') : '\n') + facture?.client?.code_postal + ' ' + facture?.client?.ville)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        < DatePicker disabled sx={{ width: '100%', minWidth: '100%' }} value={facture?.expiration} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Plaque" disabled variant="outlined" sx={{ width: "100%", textAlign: "center" }} value={facture?.vehicule?.plate} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField label="Véhicule" disabled variant="outlined" sx={{ width: "100%", textAlign: "left" }} multiline maxRows='3' minRows='3'
                            value={facture?.vehicule?.designation + "\r\n\r\n" + facture?.vehicule?.vin}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField disabled label="Kilométrage" variant="outlined" sx={{ width: "100%", textAlign: "left" }} value={facture?.kilometrage} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>}

        {rows && <DataTable sx={{ marginTop: '25px', marginBottom: '17px' }} headers={headers} rows={rows}>

        </DataTable>}

        {/*rows && <Grid container spacing={2} sx={{}}>
            <Grid item xs={7}></Grid>
            <Grid item xs={5}>
                < Paper elevation={3}>
                    <Grid container spacing={2} sx={{ paddingLeft: '15px', paddingRight: '15px', paddingBottom: '15px' }}>
                        <Grid item xs={7}>
                            <b>Total TTC :</b>
                        </Grid>
                        <Grid item xs={5}>
                            <b>{devis_total.toFixed(2) + ' €'}</b>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
</Grid>*/}

        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction
                key={'Print'}
                icon={<PrintIcon />}
                tooltipTitle={intl.formatMessage({ id: 'billing.print' })}
                onClick={async () => {
                    props.dispatch(actions.pdf.facture(facture, true))
                }}
            />
        </SpeedDial>

    </Box>;
}

export default withSnackBar(withStoreProvider(injectIntl(BillingsDisplayPage)));