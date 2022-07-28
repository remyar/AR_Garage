import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import Modal from '../Modal';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputNumber from '../../components/InputNumber';
import { withSnackBar } from '../../providers/snackBar';

function DevisAddProductModal(props) {

    const intl = props.intl;

    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState({});
    const title = props.title || "";
    const products = props.options || [];

    return <Modal display={props.display || false} >
        <Paper elevation={0}>
            {title.length > 0 && <Grid container spacing={2}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom component="div"><b>{title}</b></Typography>
                </Grid>
            </Grid>}
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Autocomplete
                        disablePortal
                        getOptionLabel={(option) => option?.brand?.toUpperCase() + ' - ' + option?.name + ' - ' + option.ref_fab}
                        options={products}
                        onChange={(event, value) => { setProduct(value) }}
                        renderInput={(params, option) => <TextField name="brand" {...params} label={intl.formatMessage({ id: 'devis.select.product' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} />}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <InputNumber label="Quantité" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="qty" onChange={(value) => {
                        setQuantity(value || 0)
                    }} component={TextField} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            if ( product.id != undefined ){
                                product.quantity = quantity;
                                props.onValidate && props.onValidate({...product});
                            } else {
                                props.snackbar.error(intl.formatMessage({ id: 'devis.no.product.selected' }));
                            }
                        }}
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
        </Paper>
    </Modal>;
}


export default injectIntl(withSnackBar(DevisAddProductModal));