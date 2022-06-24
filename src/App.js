import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from './providers/StoreProvider';
import { withSnackBar } from './providers/snackBar';
import routeMdw from './middleware/route';
import actions from './actions';

import HomePage from './pages/home';
import ClientsPage from './pages/clients';
import VehiculesPage from './pages/vehicules';
import ProduitsPage from './pages/produits';
import DevisPage from './pages/devis';
import BillingsPage from './pages/billings';
import DevisCreatePage from './pages/devisCreate';
import DevisDisplayPage from './pages/devisDisplay';
import BillingDisplayPage from './pages/billingDisplay';
import ServicesPage from './pages/services';
import SettingsPage from './pages/settings';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';

import electron from 'electron';

const routes = [
    { path: routeMdw.urlIndex(), name: 'homePage', Component: HomePage },
    { path: routeMdw.urlClients(), name: 'clientsPage', Component: ClientsPage },
    { path: routeMdw.urlVehicules(), name: 'vehiculesPage', Component: VehiculesPage },
    { path: routeMdw.urlProduits(), name: 'produitsPage', Component: ProduitsPage },
    { path: routeMdw.urlServices(), name: 'ServicesPage', Component: ServicesPage },
    { path: routeMdw.urlDevis(), name: 'devisPage', Component: DevisPage },
    { path: routeMdw.urlDevisCreate(), name: 'devisPage', Component: DevisCreatePage },
    { path: routeMdw.urlDevisDisplay(':devis_number'), name: 'devisPage', Component: DevisDisplayPage },
    { path: routeMdw.urlBillings(), name: 'devisPage', Component: BillingsPage },
    { path: routeMdw.urlBillingDisplay(':facture_number'), name: 'devisPage', Component: BillingDisplayPage },
    { path: routeMdw.urlSettings(), name: 'settingsPage', Component: SettingsPage },
];

function App(props) {

    const intl = props.intl;
    const selectedVehicule = props.globalState.selectedVehicule;

    const [drawerState, setDrawerState] = useState(false);


    useEffect(() => {
  
        electron.ipcRenderer.on('update-available', (event, message) => {
            props.snackbar.warning(intl.formatMessage({ id: 'update.available' }));
        });

        electron.ipcRenderer.on('download-progress', (event, message) => {
            props.snackbar.info(intl.formatMessage({ id: 'update.download' }) + ' : ' + parseInt(message?.percent || "0.0") + "%");
        });

        electron.ipcRenderer.on('update-downloaded', (event, message) => {
            props.snackbar.info(intl.formatMessage({ id: 'update.downloaded' }));
        });

        electron.ipcRenderer.on('update-quitForApply', (event, message) => {
            props.snackbar.success(intl.formatMessage({ id: 'update.apply' }));
        });

        electron.ipcRenderer.on('update-error', (event, message) => {
            props.snackbar.error(intl.formatMessage({ id: 'update.error' }));
        });

    }, []);

    return <Box>
        <AppBar onClick={() => { setDrawerState(true) }} title={selectedVehicule?.plate && selectedVehicule?.commercial_name ? (selectedVehicule?.plate + ' : ' + selectedVehicule?.commercial_name) : undefined}/>
        <Box sx={{paddingTop:'64px'}}>
            <Container maxWidth="xl" sx={{ /*height: 'calc(100vh - 64px)',*/ paddingTop: "25px"}} >
                <Drawer
                    open={drawerState}
                    onClose={() => { setDrawerState(false) }}
                />
                {routes.map(({ path, Component }) => (
                    <Route path={path} key={path} exact component={Component} />
                ))}
            </Container>
        </Box>
    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(App)));
