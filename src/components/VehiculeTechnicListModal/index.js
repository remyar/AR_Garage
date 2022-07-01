import React, { useState , useEffect } from 'react';
import { injectIntl } from 'react-intl';
import Modal from '../Modal';

import Paper from '@mui/material/Paper';

function VehiculeTechnicListModal(props) {

    const vehicule = props.vehicule;

    useEffect(()=>{

    },[]);
    
    return <Modal display={props.display || false}>
        <Paper elevation={0}>

        </Paper>
    </Modal>
}

export default injectIntl(VehiculeTechnicListModal);