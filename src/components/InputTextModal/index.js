import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { injectIntl } from 'react-intl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

function InputTextModal(props) {
    const intl = props.intl;

    const [input, setInput] = useState("");

    let title = props.title || "";
    let label = props.label || "";
    let type = props.type || "text";
    
    return <Modal display={props.display || false} >
        <Paper elevation={0}>
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom component="div"><b>{title}</b></Typography>
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <TextField type={type} label={label} variant="outlined" sx={{ width: "100%", textAlign: "center" }} onChange={(event) => {
                    setInput(event.target.value);
                }} />
            </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ width: '100%' }}
                    onClick={() => {
                        props.onValidate && props.onValidate(input);
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
    </Modal>;
}

export default injectIntl(InputTextModal)