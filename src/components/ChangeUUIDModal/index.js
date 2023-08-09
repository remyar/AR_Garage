import React, { useEffect, useState } from 'react';
import Modal from '../Modal';

import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DatePicker from '../DatePicker';

function ChangeUUIDModal(props) {
    const intl = props.intl;

    const [value, setValue] = useState(props.value || "");

    let title = props.title || "";
    let label = props.label || "";

    return <Modal display={props.display || false} >

        <Paper elevation={0}>
            <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                <Grid item xs={12}>
                    <TextField label={label} value={value} variant="outlined" sx={{ width: "100%", textAlign: "center" }} onChange={(event) => {
                        setValue(event.target.value);
                    }} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onClose && props.onValid(value);
                        }}
                    >{intl.formatMessage({ id: 'button.validate' })}</Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ width: '100%' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onClose && props.onClose();
                        }}
                    >{intl.formatMessage({ id: 'button.cancel' })}</Button>
                </Grid>
            </Grid>
        </Paper>
    </Modal>
}

export default withSnackBar(withStoreProvider(injectIntl(ChangeUUIDModal)));