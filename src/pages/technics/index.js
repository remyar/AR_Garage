import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import { withNavigation } from '../../providers/navigation';

import actions from '../../actions';

import DataTable from '../../components/DataTable';

import SearchComponent from '../../components/Search';
import Box from '@mui/material/Box';
import Loader from '../../components/Loader';

import routeMdw from '../../middleware/route';

function TechnicsPage(props) {

    const selectedVehicule = props.globalState.selectedVehicule;
    
    const [displayLoader, setDisplayLoader] = useState(false);
    const [manufacturers, setManufacturers] = useState([]);
    const [filter, setFilter] = useState("");

    async function fetchData() {
        setDisplayLoader(true);
        if (selectedVehicule == undefined){
            try {
                let result = await props.dispatch(actions.technics.getAllManufacturers());
                setManufacturers(result.manufacturers);
            } catch (err) {
                props.snackbar.error('fetch.error');
            }
        } else {
            let result = (await props.dispatch(actions.technics.getModelByTecdocId(selectedVehicule.tecdocId)))?.model || undefined;
            if ( result ) {
                props.navigation.push(routeMdw.urlTechnics(result.make_id));
            }
        }
        setDisplayLoader(false);
    }

    useEffect(() => {
        
        fetchData();
    }, []);

    const headers = [
        { id: 'make_name', label: 'Constructeur', minWidth: 100 },
    ];

    let rows = manufacturers.map((_v) => {
        return {
            ..._v,
            onClick: (row) => {
                props.navigation.push(routeMdw.urlTechnics(row.make_id));
            }
        }
    })

    rows = rows.sort((a, b) => (a.make_name?.toLowerCase() > b.make_name?.toLowerCase()) ? 1 : -1);

    rows = rows.filter((el) => el.make_used == true);

    rows = rows.filter((el) => el.make_name?.toLowerCase().startsWith(filter));

    return <Box sx={{ paddingBottom: '25px' }}>

        <Loader display={displayLoader} />

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <br />
        <br />
        <DataTable sx={{ height: (window.innerHeight - 200) + "px" }} headers={headers} rows={rows} />

    </Box>
}

export default withNavigation(withSnackBar(withStoreProvider(injectIntl(TechnicsPage))));