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
    marque: Yup.string().required(),
    nom: Yup.string().required(),
});


function ProductAddModal(props) {
    const intl = props.intl;
    const categories = props.globalState.catalog;
    const selectedVehicule = props.globalState.selectedVehicule;

    const [selectedCategorie, setSelectedCategorie] = useState(categories && categories[0]);
    const [displayModalAddMarque, setDisplayModalAddMarque] = useState(false);
    const [displayModalAddCategorieParent, setDisplayModalAddCategorieParent] = useState(false);
    const [displayModalAddCategorie, setDisplayModalAddCategorie] = useState(false);
   
    const [marques, setMarques] = useState([]);

    async function fetchData() {
        let result = await props.dispatch(actions.get.allMarques());
        let rows = result.marques?.data?.array?.sort((a, b) => a.brandName.toLowerCase() > b.brandName.toLowerCase() ? 1 : -1);
        setMarques(rows);
    }

    useEffect(() => {
        fetchData();
    }, []);

    let initialValues = {
        marque: '',
        nom: '',
        ref_fab: '',
        ref_oem: '',
        categorie_id: selectedCategorie?.assemblyGroupNodeId,
        subcategorie_id: (categories && categories.find((el) => el.parentNodeId == selectedCategorie?.assemblyGroupNodeId))?.assemblyGroupNodeId,
        prix_achat: '',
        prix_vente: '',
    }

    if (props.editProduct) {
        initialValues = { ...initialValues, ...props.editProduct }
    }

    if (props.tecdocproduct) {
        initialValues.marque = props.tecdocproduct?.directArticle?.brandName || "";
        initialValues.nom = props.tecdocproduct?.directArticle?.articleName || "";
        initialValues.ref_fab = props.tecdocproduct?.directArticle?.articleNo || "";

        let oemRef = "";
        if (props.tecdocproduct?.oenNumbers?.array?.length > 0){
            oemRef = props.tecdocproduct?.oenNumbers?.array.find((el) => el.brandName == selectedVehicule.brand).oeNumber.replace(/\s/g, '')
        }
        initialValues.ref_oem = oemRef;

        initialValues.assemblyGroupNodeId = props?.categorie?.assemblyGroupNodeId;

        //-- find the parent
        if (props?.categorie?.parentNodeId) {
            let _c = categories && categories.find((el) => el.assemblyGroupNodeId == props?.categorie?.parentNodeId);
            if (_c && _c.parentNodeId) {
                let __c = categories.find((el) => el.assemblyGroupNodeId == _c.parentNodeId);
                initialValues.categorie_id = __c.assemblyGroupNodeId;
                if ((selectedCategorie && selectedCategorie.assemblyGroupNodeId) != (__c && __c.assemblyGroupNodeId)) {
                    setSelectedCategorie(__c);
                }
            } else {
                initialValues.categorie_id = _c && _c.assemblyGroupNodeId;
                if ((selectedCategorie && selectedCategorie.assemblyGroupNodeId) != (_c && _c.assemblyGroupNodeId)) {
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
                                    setFieldValue("marque", value || "")
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
                                    value={values.marque}
                                    options={marques.map((r) => r.brandName.toUpperCase())}
                                    sx={{ width: '100%' }}
                                    onChange={(e, value) => setFieldValue("marque", value.toUpperCase() || "")}
                                    renderInput={(params, option) => <TextField name="marque" error={(errors.marque && touched.marque) ? true : false} {...params} label="Marque" variant="outlined" sx={{ width: "100%", textAlign: "center" }} />}
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
                                <TextField error={(errors.nom && touched.nom) ? true : false} label="Désignation" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="nom" value={values.nom} onChange={handleChange} />
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
                                            let _c = categories.find((el) => el?.assemblyGroupNodeId == event.target.value);
                                           
                                            let subCat = categories?.map((_v, idx) => {
                                                if (_v?.parentNodeId == _c?.assemblyGroupNodeId) {
                                                    return _v;
                                                }
                                            }).filter((f) => f != undefined)
                                            setFieldValue("subcategorie_id", subCat[0]?.assemblyGroupNodeId);
                                            setSelectedCategorie(_c);

                                        }}
                                        value={values?.categorie_id}
                                    >
                                        {categories?.map((_v, idx) => {
                                            if (_v?.parentNodeId == undefined) {
                                                return <MenuItem key={"categories_" + idx} value={_v?.assemblyGroupNodeId}>{_v?.assemblyGroupName}</MenuItem>
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
                                           
                                            if (selectedCategorie && selectedCategorie.hasChilds == true) {
                                                categories.map((c) => {
                                                    return c.parentNodeId == selectedCategorie.assemblyGroupNodeId ? c : undefined;
                                                }).filter((el) => el != undefined).map((_v, idx) => {
                                                    if (_v.hasChilds) {
                                                        let _name = _v.assemblyGroupName;
                                                        categories.map((c) => {
                                                            return c.parentNodeId == _v.assemblyGroupNodeId ? c : undefined;
                                                        }).filter((el) => el != undefined).map((__v) => {
                                                            let __cat = subCat.find((f) => f.assemblyGroupNodeId == __v.assemblyGroupNodeId);
                                                            if (__cat == undefined) {
                                                                let name = _name + " => " + __v.assemblyGroupName;
                                                                subCat.push({ ...__v, assemblyGroupName: name });
                                                            }
                                                        });
                                                    } else {
                                                        subCat.push(_v);
                                                    }
                                                })
                                            }
                                            return subCat.map((_v) => <MenuItem key={"subcategorie_id_" + _v?.assemblyGroupNodeId} value={_v?.assemblyGroupNodeId}>{_v?.assemblyGroupName}</MenuItem>);
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