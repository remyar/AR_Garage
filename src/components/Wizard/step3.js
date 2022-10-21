import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import actions from '../../actions';

function Step3Modal(props) {

    const intl = props.intl;
    const globalState = props.globalState;

    const [displayLoader, setDisplayLoader] = useState(false);

    return <div>
        <br />
        <ListItem disablePadding>
            <Typography variant="h6" gutterBottom component="div">{intl.formatMessage({ id: 'settings.logo.title' })}</Typography>
        </ListItem>
        <Divider />
        <ListItem>
            <Grid container spacing={2}>
                <Grid item xs={2} />
                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                    {globalState?.settings?.logo && <img src={'data:image/png;base64,' + globalState?.settings?.logo} width={305 / 2} height={140 / 2} />}
                    {!globalState?.settings?.logo && <Typography variant="h8" gutterBottom component="div">{intl.formatMessage({ id: 'settings.logo.no' })}</Typography>}
                </Grid>
                <Grid item xs={2} />
            </Grid>
        </ListItem>
        <ListItem>
            <Grid container spacing={2}>
                <Grid item xs={2} />
                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                    <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                        <Button variant="contained" onClick={async () => {
                            try {
                                setDisplayLoader(true);
                                const filename = (await props.dispatch(actions.electron.getFilenameForOpen('.png')))?.getFilenameForOpen;
                                if (filename.canceled == false) {
                                    let fileData = (await props.dispatch(actions.electron.readPng(filename.filePath)))?.fileData;
                                    await props.dispatch(actions.set.saveEntrepriseLogo(new Buffer(fileData).toString('base64')));
                                }
                            } catch (err) {
                                props.snackbar.error(err.message);
                            } finally {
                                setDisplayLoader(false);
                            }
                        }}>
                            {intl.formatMessage({ id: 'settings.logo.select' })}
                        </Button>
                    </Stack>
                </Grid>
                <Grid item xs={2} >
                    <DeleteForeverIcon sx={{marginTop : "5px" , cursor : "pointer"}} onClick={()=>{
                        props.dispatch(actions.set.saveEntrepriseLogo(new Buffer("").toString('base64')));
                    }}/>
                </Grid>
            </Grid>
        </ListItem>
        <br />
    </div>
}

export default withSnackBar(withStoreProvider(injectIntl(Step3Modal)));