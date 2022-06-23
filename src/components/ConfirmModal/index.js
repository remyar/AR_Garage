import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import Modal from '../Modal';
import { injectIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { withStoreProvider } from '../../providers/StoreProvider';
import actions from '../../actions';
import { withSnackBar } from '../../providers/snackBar';

function ConfirmModal(props) {
    const intl = props.intl;
    let title = props.title || "";

    return <Modal display={props.display || false} >
        <Paper elevation={0}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom component="div"><b>{title}</b></Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onValidate && props.onValidate();
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
    </Modal >;
}

export default withSnackBar(withStoreProvider(injectIntl(ConfirmModal)));