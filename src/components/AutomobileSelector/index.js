import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import PlaqueValue from '../PlaqueValue';
import Button from '@mui/material/Button';

function AutomobileSelector(props) {

    const intl = props.intl;

    const [plaque, setPlaque] = useState(undefined);

    return <Box sx={{ width: "100%" }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <PlaqueValue onChange={(value) => {
                    setPlaque(value);
                }} />
            </Grid>
            <Grid item xs={0}>

            </Grid>
        </Grid>
        <br />
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button variant="contained" sx={{ width: '100%' }} onClick={() => {
                    props.onClick && props.onClick({ plate: plaque});
                }}>{intl.formatMessage({ id: 'button.validate' })}</Button>
            </Grid>
        </Grid>
    </Box>
}

export default injectIntl(AutomobileSelector);