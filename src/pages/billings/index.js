import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';
import actions from '../../actions';

import routeMdw from '../../middleware/route';

import Box from '@mui/material/Box';

import SearchComponent from '../../components/Search';
import Loader from '../../components/Loader';
import DataTable from '../../components/DataTable';

function Billingspage(props) {
    const intl = props.intl;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [filter, setFilter] = useState("");
    const [factures, setFactures] = useState([]);

    async function fetchData() {
        setDisplayLoader(true);
        try{
            let result = await props.dispatch(actions.get.allFactures());
            setFactures(result.factures);
        }catch(err){
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }finally{
            setDisplayLoader(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const headers = [
        { id: 'facture_number', label: 'Facture N°', minWidth: 100 },
        { id: 'client', label: 'Client', minWidth: 100 },
        { id: 'plate', label: 'Plaque', minWidth: 100 },
        { id: 'kilometrage', label: 'Kilométrage', minWidth: 100 },
        { id: 'total', label: 'Total', minWidth: 100 },
        { id: 'emission', label: 'Date emission', minWidth: 100 },
        { id: 'expiration', label: 'Date expiration', minWidth: 100 },
    ];

    let rows = factures.map((el) => {
        let total = 0;
        el.products.forEach((_p) => {
            total += _p.prix_vente * _p.quantity;
        });

        return {
            facture_number: el.facture_number,
            plate: el.vehicule.plate,
            kilometrage: el.kilometrage,
            total: total.toFixed(2) + ' €',
            client: el.client.nom + ' ' + el.client.prenom,
            emission: (el.emission ? new Date(el.emission) : new Date()).toLocaleDateString(),
            expiration: (el.expiration ? new Date(el.expiration) : new Date()).toLocaleDateString(),
            onClick: () => {
                props.navigation.push(routeMdw.urlBillingDisplay(el.facture_number));
            },
            sx: {
                cursor: 'pointer'
            }
        }
    });
    rows = rows.sort((a, b) => a.facture_number > b.facture_number ? -1 : 1);

    rows = rows.filter((el) => el.plate.toLowerCase().startsWith(filter) || el.client.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(filter) || el.client.split(' ')[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(filter));

    return <Box sx={{ paddingBottom: '25px' }}>

        <Loader display={displayLoader} />

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <DataTable sx={{ marginTop: '25px' }} headers={headers} rows={rows}>

        </DataTable>

    </Box>;
}

export default withSnackBar(withNavigation(withStoreProvider(injectIntl(Billingspage))));