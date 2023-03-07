import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import Modal from '../Modal';
import { injectIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { withStoreProvider } from '../../providers/StoreProvider';
import actions from '../../actions';
import { withSnackBar } from '../../providers/snackBar';
import InputMask from 'react-input-mask';
import * as Yup from 'yup';


const ValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email'),
});


function ClientAddModal(props) {
    const intl = props.intl;

    const [client, setClient] = useState(props.editClient ? props.editClient : {});
    const [selectVille, setSelectVille] = useState(props.editClient && props.editClient.ville ? [{ name: props.editClient.ville }] : []);

    async function fetchData() {
        if ((client.code_postal && client.code_postal.length >= ("00000").length) || (props.editClient && (props.editClient.postal.length >= ("00000").length))) {
            try {
                let tabVille = await props.dispatch(actions.get.villesFromCp(client.code_postal ? client.code_postal : props.editClient.postal));
                setSelectVille(tabVille.code_postaux);
            } catch (err) {
                //props.snackbar.error(err.message);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [client]);

    let initialValues = {
        nom: '',
        prenom: '',
        adresse1: '',
        adresse2: '',
        code_postal: '',
        ville: '',
        telephone: '',
        email: ''
    }

    if (props.editClient) {
        initialValues = { ...initialValues, ...props.editClient }
    }

    return <Modal display={props.display || false} >
        <Paper elevation={0}>
            <Formik
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    values.nom = values.nom.toUpperCase();
                    props.onValidate && props.onValidate(values, props.editClient ? true : false);
                }}
            >
                {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom component="div"><b>{intl.formatMessage({ id: props.editClient ? 'clients.edit' : 'clients.add' })}</b></Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={6} >
                                <TextField label={intl.formatMessage({ id: 'clients.nom' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="nom" value={values.nom} onChange={handleChange} />
                            </Grid>
                            <Grid item xs={6} >
                                <TextField label={intl.formatMessage({ id: 'clients.prenom' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="prenom" value={values.prenom} onChange={handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={12} >
                                <TextField label={intl.formatMessage({ id: 'clients.adresse1' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="adresse1" value={values.adresse1} onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField label={intl.formatMessage({ id: 'clients.adresse2' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="adresse2" value={values.adresse2} onChange={handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={6} >
                                <InputMask value={values.code_postal} mask="99999" maskChar=" " name="code_postal" alwaysShowMask={false} onChange={(event) => {
                                    setClient({ ...client, code_postal: event.target.value });
                                    setFieldValue("ville", (selectVille[0] || {}).nom_de_la_commune || undefined);
                                    handleChange(event);
                                }}>
                                    {(inputProps) => <TextField {...inputProps} label={intl.formatMessage({ id: 'clients.code_postal' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} disableUnderline />}
                                </InputMask>
                            </Grid>
                            <Grid item xs={6} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{intl.formatMessage({ id: 'clients.commune' })}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        label={intl.formatMessage({ id: 'clients.commune' })}
                                        name="ville"
                                        onChange={handleChange}
                                        value={values.ville}
                                    >
                                        {selectVille && selectVille.map((_v, idx) => {
                                            return <MenuItem key={"selectVille_" + idx} value={_v.nom_de_la_commune}>{_v.nom_de_la_commune}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={6} >
                                <InputMask value={values.telephone} mask="99.99.99.99.99" maskChar=" " name="telephone" alwaysShowMask={false} onChange={handleChange}>
                                    {(inputProps) => <TextField {...inputProps} label={intl.formatMessage({ id: 'clients.telephone' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} disableUnderline />}
                                </InputMask>
                            </Grid>
                            <Grid item xs={6} >
                                <TextField error={(errors.email && touched.email) ? true : false} label={intl.formatMessage({ id: 'clients.email' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="email" value={values.email} onChange={handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                            <Grid item xs={6} sx={{ textAlign: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    sx={{ width: '100%' }}
                                >{intl.formatMessage({ id: 'button.validate' })}</Button>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ width: '100%' }}
                                    onClick={() => {
                                        props.onClose && props.onClose();
                                    }}
                                >{intl.formatMessage({ id: 'button.cancel' })}</Button>
                            </Grid>
                        </Grid>
                    </Form>)}
            </Formik>
        </Paper>
    </Modal >;
}

export default withSnackBar(withStoreProvider(injectIntl(ClientAddModal)));