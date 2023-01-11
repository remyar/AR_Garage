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
    const [displayModalAddCategorieParent, setDisplayModalAddCategorieParent] = useState(false);
    const [displayModalAddCategorie, setDisplayModalAddCategorie] = useState(false);


    const [marques, setMarques] = useState([]);

    async function fetchData() {
        let result = await props.dispatch(actions.get.allMarques());
        // let rows = result.marques.filter((el) => el.brandName != undefined && el.brandName != null && el.brandName.trim().length > 0)
        let rows = result.marques.sort((a, b) => a.brandName.toLowerCase() > b.brandName.toLowerCase() ? 1 : -1);
        setMarques(rows);

        await props.dispatch(actions.get.allCategories());
    }

    useEffect(() => {
        fetchData();
    }, []);

    let _c = categories.find((el) => el?.id == selectedCategorie?.id);
                                           
    let subCat = categories?.map((_v, idx) => {
        if (_v?.parent_id == _c?.id) {
            return _v;
        }
    }).filter((f) => f != undefined)

    let initialValues = {
        brand: '',
        name: '',
        ref_fab: '',
        ref_oem: '',
        categorie_id: 0,
        subcategorie_id: subCat[0]?.id,
        prix_achat: '',
        prix_vente: '',
    }

    if (props.editProduct) {
        initialValues = { ...initialValues, ...props.editProduct }
    }

    if (props.tecdocproduct) {
        initialValues.brand = props.tecdocproduct?.mfrName;
        initialValues.name = props.tecdocproduct?.genericArticles[0].genericArticleDescription || "";
        initialValues.ref_fab = props.tecdocproduct?.articleNumber;
        initialValues.ref_oem = (props.tecdocproduct?.oemNumbers.length > 0) && props.tecdocproduct?.oemNumbers[0].articleNumber.replace(/\s/g, '');

        initialValues.assemblyGroupNodeId = props?.categorie?.assemblyGroupNodeId;

        //-- find the parent
        if (props?.categorie?.parentNodeId) {
            let _c = categories.find((el) => el.assemblyGroupNodeId == props?.categorie?.parentNodeId);
            if (_c && _c.parentNodeId) {
                let __c = categories.find((el) => el.assemblyGroupNodeId == _c.parentNodeId);
                initialValues.categorie_id = __c.assemblyGroupNodeId;
                if (selectedCategorie.assemblyGroupNodeId != __c.assemblyGroupNodeId) {
                    setSelectedCategorie(__c);
                }
            } else {
                initialValues.categorie_id = _c.assemblyGroupNodeId;
                if (selectedCategorie.assemblyGroupNodeId != _c.assemblyGroupNodeId) {
                    setSelectedCategorie(_c);
                }
            }
        }
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

                        {displayModalAddCategorieParent && <InputTextModal
                            display={displayModalAddCategorieParent ? true : false}
                            title={intl.formatMessage({ id: 'categorie.add' })}
                            label={intl.formatMessage({ id: 'categorie.label' })}
                            onClose={() => {
                                setDisplayModalAddCategorieParent(false);
                            }}
                            onValidate={async (value) => {
                                setDisplayModalAddCategorieParent(false);
                                try {
                                    let result = await props.dispatch(actions.set.newCategorie({ nom: value.toUpperCase(), parent_id: undefined }));
                                    await fetchData();
                                    setFieldValue("categorie_id", result?.categorie?.id);
                                } catch (err) {

                                }
                            }}
                        />}

                        {displayModalAddCategorie && <InputTextModal
                            display={displayModalAddCategorie ? true : false}
                            title={intl.formatMessage({ id: 'subcategorie.add' })}
                            label={intl.formatMessage({ id: 'subcategorie.label' })}
                            onClose={() => {
                                setDisplayModalAddCategorie(false);
                            }}
                            onValidate={async (value) => {
                                setDisplayModalAddCategorie(false);
                                try {
                                    let result = await props.dispatch(actions.set.newCategorie({ nom: value.toUpperCase(), parent_id: selectedCategorie?.id }));
                                    await fetchData();
                                    setFieldValue("subcategorie_id", result?.categorie?.id);
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
                                    value={values.brand}
                                    options={marques.map((r) => r.brandName.toUpperCase())}
                                    sx={{ width: '100%' }}
                                    onChange={(e, value) => setFieldValue("brand", value.toUpperCase() || "")}
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
                            <Grid item xs={5} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{intl.formatMessage({ id: 'categorie.title' })}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        label="Catégorie"
                                        name="categorie_id"
                                        onChange={(event) => {
                                            let _c = categories.find((el) => el?.id == event.target.value);
                                           
                                            let subCat = categories?.map((_v, idx) => {
                                                if (_v?.parent_id == _c?.id) {
                                                    return _v;
                                                }
                                            }).filter((f) => f != undefined)
                                            setFieldValue("subcategorie_id", subCat[0]?.id);
                                            setSelectedCategorie(_c);
                                        }}
                                        value={values?.categorie_id}
                                    >
                                        {categories?.map((_v, idx) => {
                                            if (_v?.parent_id == undefined) {
                                                return <MenuItem key={"categories_" + idx} value={_v?.id}>{_v?.nom}</MenuItem>
                                            }
                                        }).filter((f) => f != undefined)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1} sx={{ marginTop: 'auto', marginBottom: 'auto', textAlign: "center", paddingLeft: '0px' }}>
                                <AddIcon sx={{ marginTop: '5px', cursor: 'pointer', color: 'green' }} onClick={() => {
                                    setDisplayModalAddCategorieParent(true);
                                }} />
                            </Grid>
                            <Grid item xs={5} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{intl.formatMessage({ id: 'subCategorie.title' })}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        label="Sous-Catégorie"
                                        name="subcategorie_id"
                                        onChange={handleChange}
                                        value={values?.subcategorie_id}
                                    >
                                        {(() => {
                                            let subCat = [];

                                            subCat = categories?.map((_v, idx) => {
                                                if (_v?.parent_id == selectedCategorie?.id) {
                                                    return _v;
                                                }
                                            }).filter((f) => f != undefined)

                                            return subCat.map((_v) => <MenuItem key={"subcategorie_id_" + _v?.id} value={_v?.id}>{_v?.nom}</MenuItem>);
                                        })()}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={1} sx={{ marginTop: 'auto', marginBottom: 'auto', textAlign: "center", paddingLeft: '0px' }}>
                                <AddIcon sx={{ marginTop: '5px', cursor: 'pointer', color: 'green' }} onClick={() => {
                                    setDisplayModalAddCategorie(true);
                                }} />
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