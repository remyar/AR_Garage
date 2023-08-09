import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import actions from '../../actions';

function CatalogSelectVehicule(props) {
    const intl = props.intl;

    const verticalDisplay = props.vertical || false;

    const [constructeurs, setConstructeurs] = useState([]);
    const [modelSeries, setModelSeries] = useState([]);
    const [motorisations, setMotorisations] = useState([]);

    const [selectedConstructeur, setSelectedConstructeur] = useState({});
    const [selectedModelSeries, setSelectedModelSeries] = useState({});
    const [selectedMotorisations, setSelectedMotorisations] = useState({});

    async function fetchData() {
        try {
            let result = await props.dispatch(actions.get.allManufacturers());
            setConstructeurs(result.manufacturers);
            if (props.selectedVehicule) {
                let manu = result.manufacturers.find((m) => m.manuId == props.selectedVehicule.tecdoc.manuId);
                setSelectedConstructeur(manu);
            }
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }
    }

    async function fetchModelsSeries(manuId) {
        try {
            let result = await props.dispatch(actions.get.modelSeries(manuId));
            setModelSeries(result.modelSeries);
            if (props.selectedVehicule) {
                let manu = result.modelSeries.find((m) => m.modelId == props.selectedVehicule.tecdoc.modelId);
                setSelectedModelSeries(manu);
            }
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }
    }

    async function fetchMotorisations(manuId , modelId) {
        try {
            let result = await props.dispatch(actions.get.motorisations(manuId , modelId));
            setMotorisations(result.motorisation);
            if (props.selectedVehicule) {
                let manu = result.motorisation.find((m) => m.carId == props.selectedVehicule.tecdoc.carId);
                setSelectedMotorisations(manu);
            }
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedConstructeur?.manuId != undefined) {
            props.onBrandChange && props.onBrandChange(selectedConstructeur);
            fetchModelsSeries(selectedConstructeur.manuId);
        }
    }, [selectedConstructeur]);

    useEffect(() => {
        if (selectedModelSeries?.modelId != undefined) {
            props.onModelChange && props.onModelChange(selectedModelSeries);
            fetchMotorisations(selectedConstructeur.manuId , selectedModelSeries.modelId);
        }
    }, [selectedModelSeries]);

    useEffect(() => {
        if (selectedMotorisations?.carId != undefined) {
            props.onChange && props.onChange(selectedMotorisations);
        }
    }, [selectedMotorisations]);


    return <Box sx={{ border: 0, boxShadow: 0 }}>
        <Grid container spacing={2}>
            <Grid item xs={verticalDisplay ? 12 : 4} sx={{ textAlign: 'left' }}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={constructeurs}
                    value={selectedConstructeur}
                    getOptionLabel={(option) => {
                        return option?.manuName?.toUpperCase() || "";
                    }}
                    sx={{ width: '100%' }}
                    onChange={(event, value) => { setSelectedConstructeur(value) }}
                    renderInput={(params, option) => <TextField {...params} label="Construteurs" variant="outlined" sx={{ width: "100%", textAlign: "left" }} name="Construteurs" />}
                />
            </Grid>
            <Grid item xs={verticalDisplay ? 12 : 4} sx={{ textAlign: 'left' }}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={modelSeries}
                    value={selectedModelSeries}
                    getOptionLabel={(option) => {
                        return option?.modelname?.toUpperCase() || "";
                    }}
                    sx={{ width: '100%' }}
                    onChange={(event, value) => { setSelectedModelSeries(value) }}
                    renderInput={(params, option) => <TextField {...params} label="Modéles" variant="outlined" sx={{ width: "100%", textAlign: "left" }} name="ModelSeries" />}
                />
            </Grid>
            <Grid item xs={verticalDisplay ? 12 : 4} sx={{ textAlign: 'left' }}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={motorisations}
                    value={selectedMotorisations}
                    getOptionLabel={(option) => {
                        return option?.carName?.toUpperCase() || "";
                    }}
                    sx={{ width: '100%' }}
                    onChange={(event, value) => { setSelectedMotorisations(value) }}
                    renderInput={(params, option) => <TextField {...params} label="Motorisations" variant="outlined" sx={{ width: "100%", textAlign: "left" }} name="Motorisations" />}
                />
            </Grid>
        </Grid>
    </Box>
}

export default withNavigation(withStoreProvider(withSnackBar(injectIntl(CatalogSelectVehicule))));