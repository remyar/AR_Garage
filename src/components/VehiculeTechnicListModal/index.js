import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import Modal from '../Modal';

import Paper from '@mui/material/Paper';

import actions from '../../actions';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Loader from '../../components/Loader';
import PictureModal from '../../components/DisplayPictureModal';

function VehiculeTechnicListModal(props) {

    const intl = props.intl;
    const vehicule = props.vehicule;

    const [displayLoader, setDisplayLoader] = useState(true);
    const [technics, setTechnics] = useState({});
    const [displayPicure , setDisplayPicture] = useState(undefined);

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allTechnicsByBrandAndEndigineCode(vehicule.brand, vehicule.engine_code));
            setTechnics(result.technics);
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }
        setDisplayLoader(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return <div>
        {<Modal display={displayLoader}>
            <Paper elevation={0}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        {technics.TimingBelt && <Button variant="contained" sx={{ width: '100%' }} onClick={()=>{
                            setDisplayPicture(true);
                            setDisplayLoader(false);
                        }}>hello</Button>}
                    </Grid>
                </Grid>
            </Paper>
        </Modal>}

        {displayPicure && <PictureModal />}
    </div>
}

export default withSnackBar(withStoreProvider(injectIntl(VehiculeTechnicListModal)));