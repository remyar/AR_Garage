import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withSnackBar } from '../../providers/snackBar';
import { withStoreProvider } from '../../providers/StoreProvider';
import Modal from '../Modal';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import LinearProgress from '@mui/material/LinearProgress';
import actions from '../../actions';
import utils from '../../utils';

function Installation(props) {
    const intl = props.intl;
    const [installationProgress, setInstallationProgress] = useState({ value: 0, max: 1 });

    async function fetchData() {
        try {
            let allFiles = await props.dispatch(actions.cache.getFiles());
            const installationFile = [
                "/code_postaux/laposte_hexasmal.json",
                ...allFiles.cacheFiles
            ]

            let indexToInstall = 0;
            for (let install of installationFile) {
                await props.dispatch(actions.cache.set(install));
                indexToInstall++;
                //await props.dispatch(actions.set.installationProgress({ value: indexToInstall, max: installationFile.length }));
                setInstallationProgress({ value: indexToInstall, max: installationFile.length });
            }
            props.snackbar.success('installation.success');
            await utils.sleep(2000);
            props.onFinish && props.onFinish();
        } catch (err) {
            props.snackbar.error('fetch.error');
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    return <Modal display={props.display || false}>
        <Paper elevation={0}>
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom component="div"><b>Installation en cours</b></Typography>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    {((installationProgress.value / installationProgress.max) * 100).toFixed(0)} %
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    {installationProgress.value} / {installationProgress.max}
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <LinearProgress variant="determinate" value={(installationProgress.value / installationProgress.max) * 100} />
                </Grid>
            </Grid>
        </Paper>
    </Modal>
}

export default withStoreProvider(withSnackBar(injectIntl(Installation)));