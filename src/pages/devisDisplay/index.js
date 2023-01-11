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
import PlaqueValue from '../../components/PlaqueValue';
import Paper from '@mui/material/Paper';

import Loader from '../../components/Loader';
import DatePicker from '../../components/DatePicker';
import DataTable from '../../components/DataTable';
import PrintIcon from '@mui/icons-material/Print';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';

import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import AddIcon from '@mui/icons-material/Add';

import routeMdw from '../../middleware/route';

import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

function DevisDisplayPage(props) {

    let params = useParams();

    const intl = props.intl;
    const devis_id = params?.id ? params?.id : 0;

    const [devis, setDevis] = useState({});
    const [displayLoader, setDisplayLoader] = useState(true);

    async function fetchData() {
        try {
            let result = await props.dispatch(actions.get.devisFromId(devis_id));
            setDevis(result.devi);
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
    let rows = devis?.products?.map((line) => {
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

        {devis?.id && <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom component="div"><b>{intl.formatMessage({ id: 'devis.number' }) + " " + devis?.devis_number}</b></Typography>
            </Grid>
        </Grid>}

        {devis?.id && <Grid container spacing={2} sx={{ paddingTop: '25px' }}>
            <Grid item xs={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Client" disabled variant="outlined" sx={{ width: "100%", textAlign: "center" }} value={devis?.client?.nom?.toUpperCase() + ' ' + devis?.client?.prenom} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField disabled label="Adresse" variant="outlined" sx={{ width: "100%", textAlign: "left" }} multiline maxRows='3' minRows='3'
                            value={((devis?.client?.adresse1 || "") + (devis?.client?.adresse2?.length ? ('\n' + devis?.client?.adresse2 + '\n') : '\n') + devis?.client?.code_postal + ' ' + devis?.client?.ville)}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        < DatePicker disabled sx={{ width: '100%', minWidth: '100%' }} value={devis?.expiration} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Plaque" disabled variant="outlined" sx={{ width: "100%", textAlign: "center" }} value={devis?.vehicule?.plate} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField label="Véhicule" disabled variant="outlined" sx={{ width: "100%", textAlign: "left" }} multiline maxRows='3' minRows='3'
                            value={devis?.vehicule?.designation + "\r\n\r\n" + devis?.vehicule?.vin} 
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField disabled label="Kilométrage" variant="outlined" sx={{ width: "100%", textAlign: "left" }} value={devis?.kilometrage} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>}

        {rows && <DataTable sx={{ marginTop: '25px', marginBottom: '17px' }} headers={headers} rows={rows}>

        </DataTable>}

        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction
                key={'Print'}
                icon={<PrintIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.print' })}
                onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        await props.dispatch(actions.pdf.devis(devis, true));
                    } catch (err) {
                        props.snackbar.success(err.message);
                    } finally {
                        setDisplayLoader(false);
                    }
                }}
            />
            <SpeedDialAction
                key={'ConvertToBilling'}
                icon={<CreditScoreIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.convert.to.billing' })}
                onClick={async () => {
                    await props.dispatch(actions.put.devis(devis));
                    props.snackbar.success(intl.formatMessage({ id: 'devis.convert.to.billing.success' }));
                }}
            />
        </SpeedDial>

    </Box >;
}

export default withStoreProvider(withSnackBar(injectIntl(DevisDisplayPage)));