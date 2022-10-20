import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

function Step2Modal(props) {
    return <div>
        Step 2
    </div>
}


export default withSnackBar(withStoreProvider(injectIntl(Step2Modal)));