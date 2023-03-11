import React from 'react';
import { injectIntl } from 'react-intl';
import Modal from '../Modal';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function VehiculeInformationModal(props) {

    const intl = props.intl;
    const vehicule = props.vehicule || {};

    function _generateEntry(name, value) {
        return <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
                {name}
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
                {value}
            </Grid>
        </Grid>
    }

    let _vehiculeTab = [];

    _vehiculeTab.push({ name: "plate", value: vehicule?.plate });
    _vehiculeTab.push({ name: "brand", value: vehicule?.brand });
    _vehiculeTab.push({ name: "model", value: vehicule?.model + " " + (vehicule?.phase || "") });
    _vehiculeTab.push({ name: "energie", value: vehicule?.energy });
    _vehiculeTab.push({ name: "puissance", value: vehicule?.puissance + " cv" });
    _vehiculeTab.push({ name: "engine_code", value: vehicule?.engineCode });
    _vehiculeTab.push({ name: "first_immat", value: vehicule?.immatriculationDate });

    //_vehiculeTab = _vehiculeTab.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

    return <Modal display={props.display || false}
        onClose={() => {
            //props.onClose && props.onClose();
        }}>
        <Paper elevation={0}>

            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom component="div">
                        <b>
                            {vehicule?.designation}
                        </b>
                    </Typography>
                </Grid>
            </Grid>

            {_vehiculeTab.map((_entry) => _generateEntry(intl.formatMessage({ id: 'vehicule.informations.modal.' + _entry.name }), _entry.value))}

            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onValidate && props.onValidate(vehicule);
                        }}
                    >{intl.formatMessage({ id: 'button.use' })}</Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onClose && props.onClose();
                        }}
                    >{intl.formatMessage({ id: 'button.change' })}</Button>
                </Grid>
            </Grid>

        </Paper >

    </Modal >;
}


export default injectIntl(VehiculeInformationModal);