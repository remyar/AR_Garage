import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import Modal from '../Modal';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import AutomobileSelector from "./../AutomobileSelector";
import CatalogSelectVehicule from './../CatalogSelectVehicule';

function VehiculeAddManuallyModal(props) {

    const intl = props.intl;

    const [vehicule, setVehicule] = useState({});

    return <Modal display={props.display || false}
        onClose={() => {
        }}>

        <Paper elevation={0}>
            <CatalogSelectVehicule
                onBrandChange={(brand) => {
                    vehicule.brand = brand.manuName;
                    setVehicule(vehicule);
                }}
                onModelChange={(model) => {
                    vehicule.model = model.modelname;
                    setVehicule(vehicule);
                }}
                onChange={(car) => {
                    vehicule.carName = car.carName;
                    vehicule.tecdocId = car.carId;
                    setVehicule(vehicule);
                }}

                vertical
            />

            <br />
            <AutomobileSelector onClick={async (value) => {
                vehicule.plate = value.plate;
                vehicule.designation = vehicule.brand + " " + vehicule.model + " " + vehicule.carName;
                setVehicule(vehicule);
                props.onValidate && props.onValidate(vehicule);
            }}
            />

            <br />
            <Button
                variant="contained"
                color="error"
                sx={{ width: '100%' }}
                onClick={() => {
                    props.onClose && props.onClose();
                }}
            >{intl.formatMessage({ id: 'vehicule.add.modal.close' })}</Button>
        </Paper>

    </Modal>
}

export default injectIntl(VehiculeAddManuallyModal);