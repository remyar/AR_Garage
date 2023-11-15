import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from './providers/StoreProvider';
import { withSnackBar } from './providers/snackBar';
import routeMdw from './middleware/route';
import actions from './actions';

import HomePage from './pages/home';
import InstallPage from './pages/install';
import ClientsPage from './pages/clients';
import VehiculesPage from './pages/vehicules';
import SettingsPage from './pages/settings';
import ProduitsPage from './pages/produits';
import ServicesPage from './pages/services';
import DevisPage from './pages/devis';
import DevisCreatePage from './pages/devisCreate';
import DevisDisplayPage from './pages/devisDisplay';
import BillingsPage from './pages/billings';
import BillingDisplayPage from './pages/billingDisplay';
import TechnicsPage from './pages/technics';
import TechnicsDetailsPage from './pages/technics/technics';
import ModelSeriesPage from './pages/technics/modelSeries';
import AdjustmentsPage from './pages/technics/adjustments';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';

import electron from 'electron';

const routes = [
    { path: routeMdw.urlIndex(), name: 'HomePage', Component: <HomePage /> },
    { path: routeMdw.urlHome(), name: 'HomePage', Component: <HomePage /> },
    { path: routeMdw.urlSettings(), name: 'settingsPage', Component: <SettingsPage /> },
    { path: routeMdw.urlVehicules(), name: 'vehiculesPage', Component: <VehiculesPage /> },
    { path: routeMdw.urlClients(), name: 'clientsPage', Component: <ClientsPage /> },
    { path: routeMdw.urlInstall(), name: 'InstallPage', Component: <InstallPage /> },
    { path: routeMdw.urlProduits(), name: 'ProduitsPage', Component: <ProduitsPage /> },
    { path: routeMdw.urlServices(), name: 'ServicesPage', Component: <ServicesPage /> },
    { path: routeMdw.urlDevis(), name: 'DevisPage', Component: <DevisPage /> },
    { path: routeMdw.urlDevisCreate(), name: 'DevisCreatePage', Component: <DevisCreatePage /> },
    { path: routeMdw.urlDevisEdit(':id'), name: 'DevisEditPage', Component: <DevisCreatePage /> },
    { path: routeMdw.urlDevisDisplay(':id'), name: 'DevisDisplayPage', Component: <DevisDisplayPage /> },
    { path: routeMdw.urlBillings(), name: 'BillingsPage', Component: <BillingsPage /> },
    { path: routeMdw.urlBillingDisplay(':id'), name: 'BillingDisplayPage', Component: <BillingDisplayPage /> },

    { path: routeMdw.urlTechnics(), name: 'Technics', Component: <TechnicsPage /> },
    { path: routeMdw.urlTechnics(':id'), name: 'Model Series', Component: <ModelSeriesPage /> },
    { path: routeMdw.urlTechnicsDetails(':manuId', ':modelId', ':motorId'), name: 'Technics Details', Component: <TechnicsDetailsPage /> },
    { path: routeMdw.urlTechnicsAdjustments(':motorId'), name: 'Technics Adjustment', Component: <AdjustmentsPage /> },
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


    return <Box >
        <AppBar onClick={() => { setDrawerState(true) }} title={(selectedVehicule?.plate && selectedVehicule?.designation) ? selectedVehicule?.plate + " : " + selectedVehicule?.designation : undefined} />
        <Box sx={{ paddingTop: '64px' }} >
            <Container maxWidth="xl" sx={{ paddingTop: "25px" }} >
                <Drawer
                    open={drawerState}
                    onClose={() => { setDrawerState(false) }}
                />
                <Routes >
                    {routes.map(({ path, Component }) => (
                        <Route path={path} key={path} element={Component} />
                    ))}
                </Routes>
            </Container>
        </Box>
    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(App)));
