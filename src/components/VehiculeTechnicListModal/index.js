import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import Modal from '../Modal';

import Paper from '@mui/material/Paper';

import actions from '../../actions';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

function VehiculeTechnicListModal(props) {

    const intl = props.intl;
    const vehicule = props.vehicule;

    const [technics, setTechnics] = useState({});

    async function fetchData() {
        try {
            let result = await props.dispatch(actions.get.allTechnicsByBrandAndEngineCode(vehicule.brand, vehicule.engine_code));
            setTechnics(result.technics);
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return <Modal display={props.display} onClose={()=>{
        props.onClose && props.onClose();
    }}>
        <Paper elevation={0}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    {technics.TimingBelt && <Button variant="contained" sx={{ width: '100%' }} onClick={() => {
                        props.onDisplayPicture && props.onDisplayPicture("data/tb/" + technics.TimingBelt);
                    }}>{intl.formatMessage({ id: 'technicList.TimingBelt' })}</Button>}
                </Grid>
            </Grid>
        </Paper>
    </Modal>
}

export default withSnackBar(withStoreProvider(injectIntl(VehiculeTechnicListModal)));