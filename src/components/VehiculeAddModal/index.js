import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import Modal from '../Modal';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import AutomobileSelector from "./../AutomobileSelector";

function VehiculeAddModal(props) {

    const intl = props.intl;

    return <Modal display={props.display || false}
        onClose={() => {
            //props.onClose && props.onClose();
        }}>

        <Paper elevation={0}>
            <AutomobileSelector onClick={async (value) => {
                props.onValidate && props.onValidate(value);
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

export default injectIntl(VehiculeAddModal);