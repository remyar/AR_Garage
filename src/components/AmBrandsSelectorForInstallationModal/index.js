import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import Modal from '../Modal';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

function AmBrandsSelectorForInstallationModal(props) {

    const intl = props.intl;
    const tecdoc_server = props.tecdoc_server;
    const installed = props.tecdoc;

    const [selectedAmBrands, setSelectedAmbrands] = useState(installed.filter((el) => el.installed == 1).map((el) => el.ambrand));
    let maxHeight = window.innerHeight * 0.7;    // Max height for the image

    return <Modal display={props.display || false} >
        <Paper elevation={0} >
            <Grid container sx={{ paddingBottom: '20px' }}>
                <Grid item xs={1} />
                <Grid item xs={5} />
                <Grid item xs={3} ><b>Disponible</b></Grid>
                <Grid item xs={3} ><b>Installed</b></Grid>
            </Grid>

            <Paper elevation={0} 
            style={{ 
            maxHeight : maxHeight,
            overflow : "auto"
            }} >

            {tecdoc_server && tecdoc_server.ambrands && tecdoc_server.ambrands.map((amBrand) => {
                let _installed = installed.find((el) => el.ambrand == amBrand);

                return <Grid container>
                    <Grid item xs={1}>
                        <Checkbox onChange={(event) => {
                            let index = undefined;
                            if (event.target.checked == false && selectedAmBrands.find((el, _index) => { index = _index; return el == amBrand })) {
                                //-- on l'enleve de la liste
                                selectedAmBrands[index] = undefined;
                                setSelectedAmbrands(selectedAmBrands.filter((el) => el != undefined));
                            } else {
                                if (selectedAmBrands.find((el) => el == amBrand) == undefined) {
                                    setSelectedAmbrands([...selectedAmBrands, amBrand]);
                                }
                            }
                        }} 
                        defaultChecked={((_installed.installed == 1) || (_installed.installed == true))} />
                    </Grid>
                    <Grid item xs={5} sx={{ margin: "auto" }}>
                        {amBrand}
                    </Grid>
                    <Grid item xs={3} >{(() => {
                        let d = new Date(tecdoc_server.version.buildDate);
                        return d.getFullDate() + "/" + d.getFullMonth() + "/" + d.getFullYear();
                    })()}</Grid>
                    <Grid item xs={3} >{(() => {
                        if ((_installed.installed == 1) || (_installed.installed == true)) {
                            let d = new Date(_installed.version);
                            return d.getFullDate() + "/" + d.getFullMonth() + "/" + d.getFullYear();
                        } else {
                            return null;
                        }
                    })()}</Grid>
                </Grid>
            })}
             </Paper>
            <Grid container spacing={2} sx={{ paddingTop: '20px' }}>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onValidate && props.onValidate(selectedAmBrands);
                        }}
                    >{intl.formatMessage({ id: 'button.validate' })}</Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ width: '100%' }}
                        onClick={() => {
                            props.onCancel && props.onCancel();
                        }}
                    >{intl.formatMessage({ id: 'button.cancel' })}</Button>
                </Grid>
            </Grid>
        </Paper>
    </Modal>
}

export default injectIntl(AmBrandsSelectorForInstallationModal);