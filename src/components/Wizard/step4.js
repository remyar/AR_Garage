import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import actions from '../../actions';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

function Step4Modal(props) {

    const intl = props.intl;
    const globalState = props.globalState;

    const ValidationSchema = Yup.object().shape({

    });

    let initialValues = {
    }
    
    return <Formik
        innerRef={props.formikRef || undefined}
        validationSchema={ValidationSchema}
        initialValues={initialValues}
    >
        {({ values, errors, touched, handleChange }) => (
            <Form >
                <div>
                    <br />
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item xs={10} >
                                Installer la base de données
                            </Grid>
                            <Grid item xs={2} >
                                <Switch defaultChecked />
                            </Grid>
                        </Grid>
                    </ListItem>
                    <br />
                </div>
            </Form>
        )}
    </Formik>
}

export default withSnackBar(withStoreProvider(injectIntl(Step4Modal)));