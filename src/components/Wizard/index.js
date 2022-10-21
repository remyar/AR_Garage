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
import Step3 from './step3';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import actions from '../../actions';

function WizardModal(props) {
    const intl = props.intl;
    const globalState = props.globalState;

    const [stepNumber, setStepNumber] = useState(0);
    const [formulaireChange, setFormulaireChange] = useState(globalState.settings.entreprise == undefined ? false : true);
    const formikRef = useRef(null);

    let stepComp = [];

    stepComp.push({
        ref: useRef(null),
        mandatory: true,
        component: undefined,
        onValid: (values = {}) => props.dispatch(actions.set.saveEntrepriseSettings(values))
    });
    stepComp.push({
        ref: useRef(null),
        mandatory: true,
        component: undefined,
        onValid: (values = {}) => props.dispatch(actions.set.savePaiementSettings(values))
    });
    stepComp.push({ ref: useRef(null), component: undefined });

    stepComp[0].component = <Step1 formikRef={stepComp[0].ref} onChange={() => setFormulaireChange(true)} />
    stepComp[1].component = <Step2 formikRef={stepComp[1].ref} onChange={() => setFormulaireChange(true)} />
    stepComp[2].component = <Step3 formikRef={stepComp[2].ref} onChange={() => setFormulaireChange(true)} />

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
                        disabled={(!formulaireChange) && (stepComp[stepNumber].mandatory == true)}
                        variant="outlined"
                        endIcon={<ArrowForwardIosIcon />}
                        sx={{ width: '100%' }}
                        onClick={() => {
                            if (stepComp[stepNumber].mandatory == true) {
                                stepComp[stepNumber].ref.current.validateForm();
                                if (stepComp[stepNumber].ref.current.isValid == true) {
                                    stepComp[stepNumber].onValid && stepComp[stepNumber].onValid(stepComp[stepNumber].ref.current.values);
                                    if ((stepNumber + 1) < stepComp.length) {
                                        setFormulaireChange(false);
                                        setStepNumber(stepNumber + 1);
                                    }
                                }
                            } else {
                                stepComp[stepNumber].onValid && stepComp[stepNumber].onValid(stepComp[stepNumber].ref.current.values);
                                if ((stepNumber + 1) < stepComp.length) {
                                    setFormulaireChange(false);
                                    setStepNumber(stepNumber + 1);
                                }
                            }
                        }}
                    >{intl.formatMessage({ id: 'next.step' })}</Button>}
                    {((stepNumber + 1) == stepComp.length) && <Button
                        disabled={(!formulaireChange) && (stepComp[stepNumber].mandatory == true)}
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            if (stepComp[stepNumber].mandatory == true) {
                                stepComp[stepNumber].ref.current.validateForm();
                                if (stepComp[stepNumber].ref.current.isValid == true) {
                                    setFormulaireChange(false);
                                    discardWizard();
                                }
                            } else {
                                props.snackbar.success(intl.formatMessage({ id: 'settings.societe.saved' }));
                                setFormulaireChange(false);
                                discardWizard();
                            }
                        }}
                    >{intl.formatMessage({ id: 'next.finish' })}</Button>}
                </Grid>
            </Grid>

        </Paper>
    </Modal>
}

export default withSnackBar(withStoreProvider(injectIntl(WizardModal)));