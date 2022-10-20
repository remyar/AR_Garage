import React, { useEffect, useState, useRef } from 'react';
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

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function WizardModal(props) {
    const intl = props.intl;
    const [stepNumber, setStepNumber] = useState(0);
    const [formulaireChange , setFormulaireChange] = useState(false);
    const formikRef = useRef(null);

    let stepComp = [];

    stepComp.push({ ref : useRef(null) , component : undefined});
    stepComp.push({ ref : useRef(null) , component : undefined});
    
    stepComp[0].component = <Step1 formikRef={stepComp[0].ref} onChange={()=> setFormulaireChange(true)}/>
    stepComp[1].component = <Step2 formikRef={stepComp[1].ref} onChange={()=> setFormulaireChange(true)}/>

    function discardWizard() {
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

            {stepComp[stepNumber].component}

            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        disabled={stepNumber > 0 ? false : true}
                        startIcon={<ArrowBackIosIcon />}
                        sx={{ width: '100%' }}
                        onClick={() => {
                            setStepNumber(stepNumber - 1);
                        }}
                    >{intl.formatMessage({ id: 'previous.step' })}</Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    {((stepNumber + 1) < stepComp.length) && <Button
                        disabled={!formulaireChange}
                        variant="outlined"
                        endIcon={<ArrowForwardIosIcon />}
                        sx={{ width: '100%' }}
                        onClick={() => {
                            stepComp[stepNumber].ref.current.validateForm();
                            if (stepComp[stepNumber].ref.current.isValid == true ) {
                                if ((stepNumber + 1) < stepComp.length) {
                                    setFormulaireChange(false);
                                    setStepNumber(stepNumber + 1);
                                }
                            }
                        }}
                    >{intl.formatMessage({ id: 'next.step' })}</Button>}
                    {((stepNumber + 1) == stepComp.length) && <Button
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {

                        }}
                    >{intl.formatMessage({ id: 'next.finish' })}</Button>}
                </Grid>
            </Grid>

        </Paper>
    </Modal>
}

export default withSnackBar(withStoreProvider(injectIntl(WizardModal)));