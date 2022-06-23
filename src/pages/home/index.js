import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import Box from '@mui/material/Box';

import AutomobileSelector from "../../components/AutomobileSelector";
import VehiculeInformationModal from '../../components/VehiculeInformationsModal';
import Loader from '../../components/Loader';

import actions from '../../actions';

function HomePage(props) {

    const vehicule = props.globalState.vehicule || {};

    const [displayLoader, setDisplayLoader] = useState(false);
    const [displayVehiculeModal, setDisplayVehiculeModal] = useState(false);

    return <Box>

        <Loader display={displayLoader} />

        <VehiculeInformationModal
            display={displayVehiculeModal}
            vehicule={vehicule}
            onClose={() => {
                setDisplayVehiculeModal(false);
            }}
            onValidate={async (_v)=>{
                await props.dispatch(actions.set.selectedVehicule(_v));
                setDisplayVehiculeModal(false);
            }}
        />

        <Box sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: "50%",
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        }}>
            <AutomobileSelector onClick={async (value) => {
                setDisplayLoader(true);
                try {
                    await props.dispatch(actions.get.autoFromPlate(value.plate));
                    setDisplayVehiculeModal(true);
                } catch (err) {
                    props.snackbar.error(err.message);
                }
                setDisplayLoader(false);
            }} />
        </Box>
    </Box >

}

export default withStoreProvider(withSnackBar(withNavigation(injectIntl(HomePage))));