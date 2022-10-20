import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import { Formik, Form } from 'formik';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';


function Step1Modal(props) {
    
    const intl = props.intl;

    return <Formik>
        {({ values, errors, touched, handleSubmit, handleChange }) => (
            <Form onSubmit={handleSubmit}>
                <ListItem disablePadding>
                    <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.societe.title' })}</Typography>
                </ListItem>
            </Form>
        )}
    </Formik>
}


export default withSnackBar(withStoreProvider(injectIntl(Step1Modal)));