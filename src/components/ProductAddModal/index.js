import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import Modal from '../Modal';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import actions from '../../actions';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import InputTextModal from '../../components/InputTextModal';
import InputNumber from '../../components/InputNumber';
import * as Yup from 'yup';

const ValidationSchema = Yup.object().shape({
    brand: Yup.string().required(),
    name: Yup.string().required(),
});


function ProductAddModal(props) {
    const intl = props.intl;
    const categories = props.globalState.categories;

    const [selectedCategorie, setSelectedCategorie] = useState(categories[0]);
    const [displayModalAddMarque, setDisplayModalAddMarque] = useState(false);
    const [marques, setMarques] = useState([]);

    async function fetchData() {
        let result = await props.dispatch(actions.get.allMarques());
        let rows = result.marques.filter((el) => el.name != undefined && el.name != null && el.name.trim().length > 0)
        rows = rows.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        setMarques(rows);
    }

    useEffect(() => {
        fetchData();
    }, []);

    let initialValues = {
        brand: '',
        name: '',
        ref_fab: '',
        ref_oem: '',
        categorie_id: 0,
        prix_achat: '',
        prix_vente: '',
    }

    if (props.editProduct) {
        initialValues = { ...initialValues, ...props.editProduct }
    }

    return <Modal display={props.display || false} >

        <Paper elevation={0}>
            <Formik
                initialValues={initialValues}
                validationSchema={ValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    props.onValidate && props.onValidate(values, props.editProduct ? true : false);
                }}
            >
                {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (

                    <Form onSubmit={handleSubmit}>

                        {displayModalAddMarque && <InputTextModal
                            display={displayModalAddMarque ? true : false}
                            title={intl.formatMessage({ id: 'brands.add' })}
                            label={intl.formatMessage({ id: 'brands.label' })}
                            onClose={() => {
                                setDisplayModalAddMarque(false);
                            }}
                            onValidate={async (value) => {
                                setDisplayModalAddMarque(false);
                                try {
                                    await props.dispatch(actions.set.newMarque({ name: value.toUpperCase() }));
                                    await fetchData();
                                    setFieldValue("brand", value || "")
                                } catch (err) {

                                }
                            }}
                        />}


                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom component="div"><b>{intl.formatMessage({ id: props.editProduct ? 'products.edit' : 'products.add' })}</b></Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={11} >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={marques.map((el) => el.name)}
                                    value={values.brand}
                                    getOptionLabel={(option) => option?.toUpperCase()}
                                    sx={{ width: '100%' }}
                                    onChange={(e, value) => setFieldValue("brand", value || "")}
                                    renderInput={(params, option) => <TextField name="brand" error={(errors.brand && touched.brand) ? true : false} {...params} label="Marque" variant="outlined" sx={{ width: "100%", textAlign: "center" }} />}
                                />
                            </Grid>
                            <Grid item xs={1} sx={{ marginTop: 'auto', marginBottom: 'auto', textAlign: "center", paddingLeft: '0px' }}>
                                <AddIcon sx={{ marginTop: '5px', cursor: 'pointer', color: 'green' }} onClick={() => {
                                    setDisplayModalAddMarque(true);
                                }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={12} >
                                <TextField error={(errors.name && touched.name) ? true : false} label="Désignation" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="name" value={values.name} onChange={handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={6} >
                                <TextField label="Référence fabriquant" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="ref_fab" value={values.ref_fab} onChange={handleChange} />
                            </Grid>
                            <Grid item xs={6} >
                                <TextField label="Référence OEM" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="ref_oem" value={values.ref_oem} onChange={handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={6} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        label="Catégorie"
                                        name="ville"
                                        onChange={(event) => {
                                            let _c = categories.find((el) => el.name == event.target.value);
                                            setSelectedCategorie(_c);
                                            ////handleChange(event)
                                        }}
                                        value={selectedCategorie?.id}
                                    >
                                        {categories && categories.map((_v, idx) => {
                                            return <MenuItem key={"categories_" + idx} value={_v.name}>{_v.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Sous-Catégorie</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        label="Sous-Catégorie"
                                        name="categorie_id"
                                        onChange={handleChange}
                                        value={values.categorie_id}
                                    >
                                        {selectedCategorie.sub.map((_v,idx) => {
                                            return <MenuItem key={"sub_categories_" + idx} value={_v.name}>{_v.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={6} >
                                <InputNumber label="Prix achat" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="prix_achat" value={values.prix_achat} onChange={(value) => {
                                    setFieldValue("prix_achat", value || "")
                                }} component={TextField} />
                            </Grid>
                            <Grid item xs={6} >
                            <InputNumber label="Prix vente" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="prix_vente" value={values.prix_vente} onChange={(value) => {
                                    setFieldValue("prix_vente", value || "")
                                }} component={TextField} />
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
    </Modal>
}

export default withSnackBar(withStoreProvider(injectIntl(ProductAddModal)));