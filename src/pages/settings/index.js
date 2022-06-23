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

const ValidationSchema = Yup.object().shape({
    nom: Yup.string().required(),
    adresse1: Yup.string().required(),
    adresse2: Yup.string(),
    code_postal: Yup.string().required(),
    ville: Yup.string().required(),
    email: Yup.string().email('Invalid email'),
    siret: Yup.string().required(),
    telephone: Yup.string().required(),
    rcs: Yup.string().required(),
});

const ValidationSchemaPaiement = Yup.object().shape({
    nom: Yup.string().required(),
    iban: Yup.string().required(),
    order: Yup.string().required(),
});

function SettingsPage(props) {
    const intl = props.intl;
    const globalState = props.globalState;

    const [displayLoader, setDisplayLoader] = useState(false);

    let initialValues = {
        nom: '',
        adresse1: '',
        adresse2: '',
        code_postal: '',
        ville: '',
        telephone: '',
        email: '',
        rcs: ''
    }

    let initialValuesPaiement = {
        nom: '',
        iban: '',
        order: '',
    }

    async function fetchData() {
        try {
            let result = await props.dispatch(actions.get.settings());
            console.log(result.settings);
        } catch (err) {

        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return <Box>

        <Loader display={displayLoader} />

        <List>
            <Formik
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setDisplayLoader(true);
                    await props.dispatch(actions.set.saveEntrepriseSettings(values));
                    setDisplayLoader(false);
                }}
            >
                {({ values, errors, touched, handleSubmit, handleChange }) => (
                    <Form onSubmit={handleSubmit}>
                        <ListItem disablePadding>
                            <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.societe.title' })}</Typography>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Nom" />
                            <TextField error={(errors.nom && touched.nom) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="nom" value={values.nom} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Adresse" />
                            <TextField error={(errors.adresse1 && touched.adresse1) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="adresse1" value={values.adresse1} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Adresse (complément)" />
                            <TextField error={(errors.adresse2 && touched.adresse2) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="adresse2" value={values.adresse2} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Code Postal" />
                            <InputMask value={values.code_postal} mask="99999" maskChar=" " name="code_postal" alwaysShowMask={false} onChange={handleChange}>
                                {(inputProps) => <TextField {...inputProps} variant="standard" sx={{ textAlign: "center" }} disableUnderline />}
                            </InputMask>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ville" />
                            <TextField error={(errors.ville && touched.ville) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="ville" value={values.ville} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Telephone" />
                            <InputMask value={values.telephone} mask="99.99.99.99.99" maskChar=" " name="telephone" alwaysShowMask={false} onChange={handleChange}>
                                {(inputProps) => <TextField {...inputProps} variant="standard" sx={{ textAlign: "center" }} disableUnderline />}
                            </InputMask>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Mail" />
                            <TextField error={(errors.email && touched.email) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="email" value={values.email} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Siret" />
                            <TextField error={(errors.siret && touched.siret) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="siret" value={values.siret} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Ville ( RCS )" />
                            <TextField error={(errors.rcs && touched.rcs) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="rcs" value={values.rcs} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={2} />
                                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                                    <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                                        <Button variant="contained" type="submit">
                                            {intl.formatMessage({ id: 'settings.database.societe.save' })}
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={2} />
                            </Grid>
                        </ListItem>
                    </Form>
                )}
            </Formik>
            <br />
            <Formik
                initialValues={initialValuesPaiement}
                validationSchema={ValidationSchemaPaiement}
                onSubmit={async (values, { setSubmitting }) => {
                    setDisplayLoader(true);
                    await props.dispatch(actions.set.savePaiementSettings(values));
                    setDisplayLoader(false);
                }}
            >
                {({ values, errors, touched, handleSubmit, handleChange }) => (
                    <Form onSubmit={handleSubmit}>
                        <ListItem disablePadding>
                            <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.paiement.title' })}</Typography>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText primary="Nom associé au compte bancaire" />
                            <TextField error={(errors.nom && touched.nom) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="nom" value={values.nom} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="IBAN" />
                            <TextField error={(errors.iban && touched.iban) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="iban" value={values.iban} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Chéque a l'ordre de" />
                            <TextField error={(errors.order && touched.order) ? true : false} variant="standard" sx={{ textAlign: "center" }} name="order" value={values.order} onChange={handleChange} />
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={2} />
                                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                                    <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                                        <Button variant="contained" type="submit">
                                            {intl.formatMessage({ id: 'settings.database.societe.save' })}
                                        </Button>
                                    </Stack>
                                </Grid>
                                <Grid item xs={2} />
                            </Grid>
                        </ListItem>
                    </Form>
                )}
            </Formik>
            <br />
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.logo.title' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={2} />
                    <Grid item xs={8} sx={{ textAlign: 'center' }}>
                        <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                            <Button variant="contained" onClick={async () => {

                                try {
                                    setDisplayLoader(true);
                                    const filename = (await props.dispatch(actions.electron.getFilenameForOpen('.png')))?.getFilenameForOpen;
                                    if (filename.canceled == false) {
                                        let fileData = (await props.dispatch(actions.electron.readPng(filename.filePath)))?.fileData;
                                        await props.dispatch(actions.set.saveEntrepriseLogo(new Buffer(fileData).toString('base64')));
                                    }
                                } catch (err) {

                                } finally {
                                    setDisplayLoader(false);
                                }
                            }}>
                                {intl.formatMessage({ id: 'settings.logo.select' })}
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </ListItem>
            <br />
            <ListItem disablePadding>
                <Typography variant="h5" gutterBottom component="div">{intl.formatMessage({ id: 'settings.database.title' })}</Typography>
            </ListItem>
            <Divider />
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={2} />
                    <Grid item xs={8} sx={{ textAlign: 'center' }}>
                        <Stack direction="row" spacing={2} sx={{ display: 'block' }}>
                            <Button variant="contained" onClick={async () => {

                                try {
                                    setDisplayLoader(true);
                                    const filename = (await props.dispatch(actions.electron.getFilenameForSave('.json')))?.getFilenameForSave;
                                    if (filename.canceled == false) {
                                        await props.dispatch(actions.electron.writeFile(filename.filePath, JSON.stringify(globalState)));
                                    }
                                } catch (err) {
                                    props.snackbar.error(err.message);
                                } finally {
                                    setDisplayLoader(false);
                                }
                            }}>
                                {intl.formatMessage({ id: 'settings.database.export' })}
                            </Button>
                            <Button variant="contained" onClick={async () => {
                                try {
                                    setDisplayLoader(true);
                                    const filename = (await props.dispatch(actions.electron.getFilenameForOpen('.json')))?.getFilenameForOpen;
                                    if (filename.canceled == false) {
                                        let fileData = (await props.dispatch(actions.electron.readFile(filename.filePath)))?.fileData;
                                        await props.dispatch(actions.database.restore(JSON.parse(fileData)));
                                    }
                                } catch (err) {
                                    props.snackbar.error(err.message);
                                } finally {
                                    setDisplayLoader(false);
                                }
                            }}>
                                {intl.formatMessage({ id: 'settings.database.import' })}
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={2} />
                </Grid>
            </ListItem>
        </List>
    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(SettingsPage)));