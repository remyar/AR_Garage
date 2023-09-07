import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import Modal from '../Modal';
import * as Yup from 'yup';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const ValidationSchema = Yup.object().shape({
    ref_fab: Yup.string().required(),
    nom: Yup.string().required(),
});

function ProductAddModal(props) {
    const intl = props.intl;

    let initialValues = {
        ref_fab: '',
        nom: '',
    }

    if (props.editProduct?.id != undefined) {
        initialValues = { ...props.editProduct };
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

                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom component="div"><b>{intl.formatMessage({ id: props.editProduct ? 'products.edit' : 'products.add' })}</b></Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={12} >
                                <TextField label="Référence" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="ref_fab" value={values.ref_fab} onChange={handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                            <Grid item xs={12} >
                                <TextField label="Désignation" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="nom" value={values.nom} onChange={handleChange} />
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
                    </Form>
                )}
            </Formik>
        </Paper>
    </Modal>
}

export default withSnackBar(withStoreProvider(injectIntl(ProductAddModal)));