import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';
import { useParams } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

import DataTable from '../../components/DataTable';
import PlaqueValue from '../../components/PlaqueValue';
import DatePicker from '../../components/DatePicker';
import actions from '../../actions';

import ClientAddModal from '../../components/ClientAddModal';
import DevisAddProductModal from '../../components/DevisAddProductModal';
import DevisAddServiceModal from '../../components/DevisAddServiceModal';

import Loader from '../../components/Loader';

function DevisCreatePage(props) {
    const intl = props.intl;
    let params = useParams();

    const [displayLoader, setDisplayLoader] = useState(false);

    const [clients, setClients] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [produits, setProduits] = useState([]);
    const [services, setServices] = useState([]);

    const [selectedClient, setSelectedClient] = useState({});
    const [selectedVehicule, setSelectedVehicule] = useState(props.globalState.selectedVehicule);

    const [displayClientAddModal, setDisplayClientAddModal] = useState(false);

    const [displayProductAddToDevisModal, setDisplayProductAddToDevisModal] = useState(false);
    const [displayServiceAddToDevisModal, setDisplayServiceAddToDevisModal] = useState(false);

    const [lines, setLines] = useState([]);
    const [expiration, setExpiration] = useState(new Date());

    const [devisNumber, setDevisNumber] = useState(0);

    async function fetchData() {
        let result = await props.dispatch(actions.get.allClients());
        setClients(result.clients);
        result = await props.dispatch(actions.get.allVehicules());
        setVehicules(result.vehicules);
        result = await props.dispatch(actions.get.allProducts());
        setProduits(result.products.filter((el) => ((el.deleted !== 1) && (el.deleted !== true))));
        result = await props.dispatch(actions.get.allServices());
        setServices(result.services.filter((el) => ((el.deleted !== 1) && (el.deleted !== true))));


    }
    
    async function _fetchData(){
        await fetchData();
        if ( params.id != undefined ){
            let result = await props.dispatch(actions.get.devis(params.id));
            setSelectedClient(result.devis.client);
            await props.dispatch(actions.set.selectedVehicule(result.devis.vehicule));
            setSelectedVehicule(result.devis.vehicule);
            setLines([...result.devis.products]);
        }
    }
    useEffect(() => {
        _fetchData();
    }, []);

    const headers = [
        { id: 'ref_fab', label: 'Code', minWidth: 100 },
        { id: 'nom', label: 'Désignation', minWidth: 100 },
        { id: 'qty', label: 'Quantité', minWidth: 100 },
        { id: 'tarif_vente', label: 'Tarif Unitaire', minWidth: 100 },
        { id: 'tarif_total', label: 'Total TTC', minWidth: 100 },
    ];

    let rows = lines.map((line) => {
        let tarif_total = parseFloat(line.quantity.toString()) * parseFloat(line.taux.toString());
        let tarif_vente = parseFloat(line.taux.toString()).toFixed(2) + ' €';
        return { ...line, name: ((line.brand ? line.brand : '') + ' ' + line.nom).trim(), info: '', qty: line.quantity, tarif_vente, tarif_total: tarif_total.toFixed(2) + ' €' };
    });

    return <Box sx={{ paddingBottom: '25px' }}>

        <Loader display={displayLoader} />

        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom component="div"><b>{intl.formatMessage({ id: 'devis.add' })}</b></Typography>
            </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ paddingTop: '25px' }}>
            <Grid item xs={6}>
                <Grid container spacing={2}>
                    <Grid item xs={11}>

                        {displayClientAddModal && <ClientAddModal
                            display={displayClientAddModal}
                            onClose={() => {
                                setDisplayClientAddModal(false);
                            }}
                            onValidate={async (client, edit) => {
                                try {
                                    let result = await props.dispatch(actions.set.client(client));
                                    await fetchData();
                                    setSelectedClient(result.client);
                                } catch (err) {
                                    console.error(err)
                                }
                                setDisplayClientAddModal(false);
                            }}
                        />}


                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={clients}
                            value={selectedClient}
                            getOptionLabel={(option) => {
                                if (option?.nom || option?.prenom) {
                                    return (option?.nom?.toUpperCase() + ' ' + option?.prenom);
                                } else {
                                    return "";
                                }
                            }}
                            sx={{ width: '100%' }}
                            onChange={(event, value) => { setSelectedClient(value) }}
                            renderInput={(params, option) => <TextField {...params} label="Client" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="Client" />}
                        />
                    </Grid>
                    <Grid item xs={1} sx={{ marginTop: 'auto', marginBottom: 'auto', textAlign: "center", paddingLeft: '0px' }}>
                        <AddIcon sx={{ marginTop: '5px', cursor: 'pointer', color: 'green' }} onClick={() => {
                            setDisplayClientAddModal(true);
                        }} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField label="Adresse" focused variant="outlined" sx={{ width: "100%", textAlign: "left" }} name="Adresse" multiline maxRows='3' minRows='3'
                            value={((selectedClient?.adresse1 || "") + (selectedClient?.adresse2?.length ? ('\n' + selectedClient?.adresse2 + '\n') : '\n') + (selectedClient?.code_postal || "") + ' ' + (selectedClient?.ville || ""))}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        < DatePicker sx={{ width: '100%', minWidth: '100%' }} onChange={(value) => {
                            setExpiration(value.getTime());
                        }} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <PlaqueValue
                            value={selectedVehicule?.plate}
                            onChange={async (value) => {
                                if (value.endsWith("*") == false) {
                                    let v = vehicules.find((_v) => _v.plate === value);
                                    if (v !== undefined) {
                                        await props.dispatch(actions.set.selectedVehicule(v));
                                        setSelectedVehicule(v);
                                    } else {
                                        setDisplayLoader(true);
                                        try {
                                            let result = await props.dispatch(actions.get.autoFromPlate(value));
                                            await props.dispatch(actions.set.selectedVehicule(result.vehicule));
                                            setSelectedVehicule(result.vehicule);
                                        } catch (err) {
                                            await props.dispatch(actions.set.selectedVehicule(undefined));
                                            setSelectedVehicule(undefined);
                                            props.snackbar.error(err.message);
                                        } finally {
                                            setDisplayLoader(false);
                                        }
                                    }

                                    await fetchData();
                                }
                            }} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ paddingTop: '15px' }}>
                    <Grid item xs={12}>
                        <TextField label="Vehicule" focused variant="outlined" sx={{ width: "100%", textAlign: "left" }} name="Vehicule" multiline maxRows='3' minRows='3'
                            value={(selectedVehicule?.designation || "") + "\r\n\r\n" + (selectedVehicule?.vin || "")}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

        {displayProductAddToDevisModal && <DevisAddProductModal
            display={displayProductAddToDevisModal}
            title={intl.formatMessage({ id: 'devis.add.product' })}
            options={produits}
            onClose={() => { setDisplayProductAddToDevisModal(false); }}
            onValidate={(product) => {
                lines.push(product);
                setLines([...lines]);
                setDisplayProductAddToDevisModal(false);
            }}
        />}

        {displayServiceAddToDevisModal && <DevisAddServiceModal
            display={displayServiceAddToDevisModal}
            title={intl.formatMessage({ id: 'devis.add.service' })}
            options={services}
            onClose={() => { setDisplayServiceAddToDevisModal(false); }}
            onValidate={(service) => {
                lines.push(service);
                setLines([...lines]);
                setDisplayServiceAddToDevisModal(false);
            }}
        />}

        <DataTable sx={{ marginTop: '25px' }} headers={headers} rows={rows}>

        </DataTable>

        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction
                key={'AddProduct'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.add.product' })}
                onClick={async () => {
                    setDisplayProductAddToDevisModal(true);
                }}
            />
            <SpeedDialAction
                key={'AddMO'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.add.main_oeuvre' })}
                onClick={async () => {
                    setDisplayServiceAddToDevisModal(true);
                }}
            />

            <SpeedDialAction
                key={'PendingDevis'} 
                icon={<PauseCircleFilledIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.pending' })}
                onClick={async () => {
                    let devis = {
                        id : params.id,
                        facture_id : undefined,
                        client: { ...selectedClient },
                        vehicule: { ...selectedVehicule },
                        date: new Date().getTime(),
                        expiration: expiration,
                        products: [...lines],
                        isPending : true,
                        paye : false,
                    }

                    await props.dispatch(actions.set.saveDevis(devis));
                    props.snackbar.info('devis.pending.success');
                    props.navigation.goBack();
                }}
            />

            <SpeedDialAction
                key={'SaveDevis'}
                icon={<SaveIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.save' })}
                onClick={async () => {
                    let devis = {
                        id : params.id,
                        facture_id : undefined,
                        client: { ...selectedClient },
                        vehicule: { ...selectedVehicule },
                        date: new Date().getTime(),
                        expiration: expiration,
                        products: [...lines],
                        isPending : false,
                        paye : false,
                    }

                    await props.dispatch(actions.set.saveDevis(devis));
                    props.snackbar.success('devis.save.success');
                    props.navigation.goBack();

                }}
            />
            <SpeedDialAction
                key={'Print'}
                icon={<PrintIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.print' })}
                onClick={async () => {

                    let devis = {
                        devis_number: devisNumber,
                        client: selectedClient,
                        client_id: selectedClient?.id,
                        vehicule_id: selectedVehicule?.id,
                        kilometrage: selectedVehicule?.kilometrage,
                        date: new Date().getTime(),
                        expiration: expiration,
                        products: [],
                    }
                    lines.forEach((line) => {
                        devis.products.push({ ...line, product_id: line.id, quantity: line.quantity });
                    });
                    props.dispatch(actions.pdf.devis(devis, true))
                }}
            />
        </SpeedDial>

    </Box>
}
export default withNavigation(withStoreProvider(withSnackBar(injectIntl(DevisCreatePage))));