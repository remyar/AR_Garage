import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';

import Modal from '../Modal';
import Paper from '@mui/material/Paper';

function CatalogProductDetails(props) {
    const intl = props.intl;

    return <Modal display={props.display || false}
        onClose={() => {
            props.onClose && props.onClose();
        }}>
        <Paper elevation={0}>

        </Paper>

    </Modal>
}

export default withNavigation(withStoreProvider(withSnackBar(injectIntl(CatalogProductDetails))));