import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';

import Box from '@mui/material/Box';

function InstallPage(props) {

    useEffect(() => {

    }, []);

    return <Box>

     
    </Box>
}
export default withStoreProvider(withNavigation(injectIntl(InstallPage)));