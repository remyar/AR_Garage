import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import Modal from '../Modal';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import CloseIcon from '@mui/icons-material/Close';

import Button from '@mui/material/Button';

function CatalogProductDetails(props) {

    const intl = props.intl;
    const product = props.product;

    return <Modal display={props.display || false}
        sx={{ width: '80%', height: '80%', overflow: 'auto' }}>
        <CloseIcon
            sx={{ cursor: "pointer", position: "absolute", color: 'black', top: '16px', right: '16px' }}
            onClick={() => {
                props.onClose && props.onClose();
            }}
        />
        <Paper elevation={0}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <List>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.brand' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    {product?.brandName}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.productNum' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    <b>{product?.articleNo}</b>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.productGroup' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    {product?.directArticle?.articleName || ""}
                                </Grid>
                            </Grid>
                        </ListItem>
                        {product?.misc?.additionalDescription && <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.productDesignationSupp' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    {product?.misc?.additionalDescription || ""}
                                </Grid>
                            </Grid>
                        </ListItem>}
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.status' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    {product?.misc?.articleStatusDescription || ""}
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <AliceCarousel
                        disableDotsControls
                    >
                        {product?.articleThumbnails?.array?.map((image, i) => {
                            if ( image?.document && image?.document?.length > 0){
                                return <img width={400} key={i} src={"data:image/png;base64, " + image?.document} />
                            } else {
                                return <img width={400} key={i} src={"./no-image-available.jpg"} />
                            }
                        })}
                    </AliceCarousel>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ paddingTop: "24px" }}>
                <Grid item xs={6}>
                    <List>
                        <ListItem sx={{ backgroundColor: "#EDEDED" }}><b>Généralités</b></ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.productNum' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    {product?.articleNo}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.gtin_ean' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    {product?.eanNumber?.array?.map((ean) => ean.eanNumber)}
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <b>{intl.formatMessage({ id: 'product.quantityPerPackage' })}</b>
                                </Grid>
                                <Grid item xs={6}>
                                    {product?.directArticle?.quantityPerPackingUnit}
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem sx={{ backgroundColor: "#EDEDED" }}><b>Réf. OE</b></ListItem>
                        {product?.oenNumbers?.array?.map((oem) => {
                            return <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <b>{oem?.brandName}</b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {oem?.oeNumber.replace(/\s/g, '')}
                                    </Grid>
                                </Grid>
                            </ListItem>
                        })}
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <List>
                        <ListItem sx={{ backgroundColor: "#EDEDED" }}><b>Critéres</b></ListItem>
                        {product?.articleAttributes?.array?.map((critere) => {
                            return <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <b>{critere?.attrName || ""}</b>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {critere?.attrValue || ""}
                                    </Grid>
                                </Grid>
                            </ListItem>
                        })}
                    </List>
                    <List>
                        <ListItem sx={{ backgroundColor: "#EDEDED" }}><b>Affectation véhicule</b></ListItem>
                    </List>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ paddingTop: "24px" }}>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onValidate && props.onValidate(product);
                        }}
                    >{intl.formatMessage({ id: 'button.Add.to.product' })}</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onClose && props.onClose();
                        }}
                    >{intl.formatMessage({ id: 'button.close' })}</Button>
                </Grid>
            </Grid>
        </Paper>
    </Modal>
}

export default withNavigation(withStoreProvider(withSnackBar(injectIntl(CatalogProductDetails))));