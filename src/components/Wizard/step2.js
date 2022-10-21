import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import InputMask from 'react-input-mask';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import Switch from '@mui/material/Switch';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';

import actions from '../../actions';
import Loader from '../../components/Loader';


import * as Yup from 'yup';
import { Formik, Form } from 'formik';

function Step2Modal(props) {

    const intl = props.intl;
    const globalState = props.globalState;

    const ValidationSchema = Yup.object().shape({
        nom: Yup.string().required(),
        iban: Yup.string().required(),
        order: Yup.string().required(),
    });

    let initialValues = {
        nom: globalState?.settings?.paiement?.nom || '',
        iban: globalState?.settings?.paiement?.iban || '',
        order: globalState?.settings?.paiement?.order || '',
    }

    return <Formik
        innerRef={props.formikRef || undefined}
        validationSchema={ValidationSchema}
        initialValues={initialValues}
    >
        {({ values, errors, touched, handleChange }) => (
            <Form >
                <br />
                <ListItem disablePadding>
                    <Typography variant="h6" gutterBottom component="div">{intl.formatMessage({ id: 'settings.paiement.title' })}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Nom associé au compte bancaire" />
                    <TextField error={(errors.nom) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="nom" value={values.nom} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="IBAN" />
                    <TextField error={(errors.iban) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="iban" value={values.iban} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Chéque a l'ordre de" />
                    <TextField error={(errors.order) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="order" value={values.order} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}}/>
                </ListItem>
                <br />
            </Form>
        )}
    </Formik>
}


export default withSnackBar(withStoreProvider(injectIntl(Step2Modal)));