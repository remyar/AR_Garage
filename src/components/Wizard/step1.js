import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import InputMask from 'react-input-mask';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

function Step1Modal(props) {

    const intl = props.intl;
    const globalState = props.globalState;

    const ValidationSchema = Yup.object().shape({
        nom: Yup.string().required(),
        adresse1: Yup.string().required(),
        adresse2: Yup.string(),
        code_postal: Yup.string().required(),
        ville: Yup.string().required(),
        email: Yup.string().email(),
        siret: Yup.string().required(),
        telephone: Yup.string().required(),
        rcs: Yup.string().required(),
    });

    let initialValues = {
        nom: globalState?.settings?.entreprise?.nom || "",
        adresse1: globalState?.settings?.entreprise?.adresse1 || "",
        adresse2: globalState?.settings?.entreprise?.adresse2 || "",
        code_postal: globalState?.settings?.entreprise?.code_postal || "",
        ville: globalState?.settings?.entreprise?.ville || "",
        telephone: globalState?.settings?.entreprise?.telephone || "",
        email: globalState?.settings?.entreprise?.email || "",
        siret: globalState?.settings?.entreprise?.siret || "",
        rcs: globalState?.settings?.entreprise?.rcs || "",
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
                    <Typography variant="h6" gutterBottom component="div">{intl.formatMessage({ id: 'settings.societe.title' })}</Typography>
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary="Nom" />
                    <TextField error={(errors.nom) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="nom" value={values.nom} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Adresse" />
                    <TextField error={(errors.adresse1) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="adresse1" value={values.adresse1} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Adresse (complément)" />
                    <TextField error={(errors.adresse2) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="adresse2" value={values.adresse2} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Code Postal" />
                    <InputMask error={(errors.code_postal) ? true : false} value={values.code_postal} mask="99999" maskChar=" " name="code_postal" alwaysShowMask={false} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}}>
                        {(inputProps) => <TextField {...inputProps} variant="standard" sx={{ textAlign: "center", width: "50%" }} disableunderline />}
                    </InputMask>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Ville" />
                    <TextField error={(errors.ville) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="ville" value={values.ville} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Telephone" />
                    <InputMask error={(errors.telephone) ? true : false} value={values.telephone} mask="99.99.99.99.99" maskChar=" " name="telephone" alwaysShowMask={false} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}}>
                        {(inputProps) => <TextField {...inputProps} variant="standard" sx={{ textAlign: "center", width: "50%" }} disableunderline />}
                    </InputMask>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Mail" />
                    <TextField error={(errors.email ) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="email" value={values.email} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Siret" />
                    <TextField error={(errors.siret ) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="siret" value={values.siret} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <ListItem>
                    <ListItemText primary="Ville ( RCS )" />
                    <TextField error={(errors.rcs ) ? true : false} variant="standard" sx={{ textAlign: "center", width: "50%" }} name="rcs" value={values.rcs} onChange={(e) => { props.onChange && props.onChange(e); handleChange(e);}} />
                </ListItem>
                <br />
            </Form>
        )}
    </Formik>
}


export default withSnackBar(withStoreProvider(injectIntl(Step1Modal)));