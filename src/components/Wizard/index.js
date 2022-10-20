import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

import Step1 from './step1';
import Step2 from './step2';

function WizardModal(props) {
    const intl = props.intl;
    const [stepNumber, setStepNumber] = useState(0);

    let stepComp = undefined;

    switch (stepNumber) {
        case 0:
            {
                stepComp = <Step1 />;
                break;
            }
        case 1:
            {
                stepComp = <Step2 />;
                break;
            }
    }

    function discardWizard(){
        props.onClose && props.onClose();
    }

    return <Modal display={true} >
        <Paper elevation={0}>
            <Grid container spacing={2}>
                <Grid item xs={10} sx={{ textAlign: 'start' }}>
                    <Typography variant="h6" gutterBottom component="div"><b>{intl.formatMessage({ id: 'settings.wizard' })}</b></Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "end" }}>
                        <CloseIcon onClick={() => {
                            discardWizard();
                        }}
                            sx={{ cursor: "pointer" }}
                        />
                    </Grid>
            </Grid>

            {stepComp}

            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            setStepNumber(stepNumber + 1);
                        }}
                    >{intl.formatMessage({ id: 'button.validate' })}</Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onClose && props.onClose();
                        }}
                    >{intl.formatMessage({ id: 'button.cancel' })}</Button>
                </Grid>
            </Grid>

        </Paper>
    </Modal>
}

export default withSnackBar(withStoreProvider(injectIntl(WizardModal)));