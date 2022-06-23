import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';

import actions from '../../actions';

import Box from '@mui/material/Box';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';

import ConfirmModal from '../../components/ConfirmModal';
import SearchComponent from '../../components/Search';
import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';

import routeMdw from '../../middleware/route';

function DevisPage(props) {
    const intl = props.intl;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [filter, setFilter] = useState("");
    const [devis, setDevis] = useState([]);

    useEffect(() => {
        setDisplayLoader(true);
        async function fetchData() {
            try {
                let result = await props.dispatch(actions.get.allDevis());
                setDevis(result.devis);
            } catch (err) {
                props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
            } finally {
                setDisplayLoader(false);
            }
        }
        fetchData();
    }, []);

    const headers = [
        { id: 'devis_number', label: 'Devis N°', minWidth: 100 },
        { id: 'client', label: 'Client', minWidth: 100 },
        { id: 'plate', label: 'Plaque', minWidth: 100 },
        { id: 'kilometrage', label: 'Kilométrage', minWidth: 100 },
        { id: 'total', label: 'Total', minWidth: 100 },
        { id: 'emission', label: 'Date emission', minWidth: 100 },
        { id: 'expiration', label: 'Date expiration', minWidth: 100 },
    ];

    let rows = devis.map((el) => {
        let total = 0;
        el.products.forEach((_p) => {
            total += (_p?.prix_vente || 0) * (_p?.quantity || 0);
        });

        return {
            devis_number: el.devis_number,
            plate: el.vehicule?.plate,
            kilometrage: el.kilometrage,
            total: total.toFixed(2) + ' €',
            client: el?.client?.nom + ' ' + el?.client?.prenom,
            emission: (el.emission ? new Date(el.emission) : new Date()).toLocaleDateString(),
            expiration: (el.expiration ? new Date(el.expiration) : new Date()).toLocaleDateString(),
            onClick: () => {
                props.navigation.push(routeMdw.urlDevisDisplay(el.devis_number));
            },
            sx: {
                cursor: 'pointer'
            }
        }
    });
    rows = rows.sort((a, b) => a.devis_number > b.devis_number ? -1 : 1);

    rows = rows.filter((el) => el?.plate?.toLowerCase().startsWith(filter) || el?.client?.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(filter) || el.client.split(' ')[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(filter));

    return <Box sx={{ paddingBottom: '25px' }}>

        <Loader display={displayLoader} />

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <DataTable sx={{ marginTop: '25px' }} headers={headers} rows={rows}>

        </DataTable>

        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction
                key={'NewVehicule'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'devis.add' })}
                onClick={async () => {
                    props.navigation.push(routeMdw.urlDevisCreate());
                }}
            />
        </SpeedDial>

    </Box>
}
export default withNavigation(withStoreProvider(withSnackBar(injectIntl(DevisPage))));