import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import { withNavigation } from '../../providers/navigation';
import { useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import Loader from '../../components/Loader';

import actions from '../../actions';

function TechnicsDetailsPage(props) {

    let params = useParams();
    params.manuId = parseInt(params.manuId);
    params.modelId = parseInt(params.modelId);
    params.motorId = parseInt(params.motorId);


    const [displayLoader, setDisplayLoader] = useState(false);
    const [adjustment, setAdjustment] = useState(undefined);
    


    async function fetchData() {
        try{
            setDisplayLoader(true);
            let result = await props.dispatch(actions.technics.getAdjustmentByTypeId(params.motorId));
            setAdjustment(result.adjustment);
            /*
            let result = await props.dispatch(actions.technics.getManufacturerById(params.manuId));
            setManufacturer(result.manufacturer);
            result = await props.dispatch(actions.technics.getModelSeriesById(params.modelId));
            setModelSerie(result.modelSeries);
            result = await props.dispatch(actions.technics.getMotorById(params.motorId));
            setEngine(result.motor);
*/
            setDisplayLoader(false);
        }catch(err){
            props.snackbar.error('fetch.error');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return <Box sx={{ paddingBottom: '25px', overflow: 'hidden' }}>

        <Loader display={displayLoader} />

    </Box>
}

export default withNavigation(withSnackBar(withStoreProvider(injectIntl(TechnicsDetailsPage))));