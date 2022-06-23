import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import actions from '../../actions';

import Box from '@mui/material/Box';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';

import ConfirmModal from '../../components/ConfirmModal';
import SearchComponent from '../../components/Search';
import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';

import VehiculeInformationModal from '../../components/VehiculeInformationsModal';


import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';

function VehiculesPage(props) {
    const intl = props.intl;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [vehicules, setVehicules] = useState([]);
    const [displayConfirmModal, setDisplayConfirmModal] = useState(undefined);
    const [displaVehiculeAddModal, setDisplayVehiculeAddModal] = useState(false);
    const [displayVehiculeModal, setDisplayVehiculeModal] = useState(undefined);
    const [filter, setFilter] = useState("");

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allVehicules());
            setVehicules(result.vehicules.filter((el) => el.deleted !== 1));
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }
        setDisplayLoader(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const headers = [
        { id: 'plate', label: 'Plaque', minWidth: 100 },
        { id: 'commercial_name', label: 'Modéle', minWidth: 100 },
        { id: 'puissance', label: 'Puissance', minWidth: 100 },
        { id: 'energie', label: 'Energie', minWidth: 100 },
        { id: 'engine_code', label: 'Code Moteur', minWidth: 100 },
        {
            label: '', maxWidth: 50, minWidth: 50, render: (row) => {
                return <span>
                    <BuildIcon sx={{ cursor: 'pointer' }} onClick={() => {
                        let vehicule = { 
                            id : row.id,
                            brand : row.brand ,
                            energie : row.energie,
                            engine_code : row.engine_code,
                            first_batch : row.first_batch,
                            last_batch : row.last_batch,
                            model : row.model,
                            plate : row.plate,
                            puissance : row.puissance,
                            commercial_name : row.commercial_name
                        }
                        setDisplayVehiculeModal(vehicule);
                    }} />
                    <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer', marginLeft: '15px' }} onClick={() => {
                        setDisplayConfirmModal(row);
                    }} />
                </span>
            }
        }
    ];

    let rows = [...vehicules];

    rows = rows.sort((a, b) => a.plate.toLowerCase() > b.plate.toLowerCase() ? 1 : -1);

    rows = rows.filter((el) => el.plate.toLowerCase().startsWith(filter))

    return <Box sx={{ paddingBottom: '25px' }}>

        <Loader display={displayLoader} />

        {displayConfirmModal && <ConfirmModal
            display={displayConfirmModal ? true : false}
            onClose={() => {
                setDisplayConfirmModal(undefined);
            }}
            onValidate={async (data) => {
                let idToDelete = displayConfirmModal.id;
                setDisplayConfirmModal(undefined);
                setDisplayLoader(true);
                setVehicules([]);
                await props.dispatch(actions.del.vehicule(idToDelete));
                await fetchData();
                setDisplayLoader(false);
            }}
        />}

        {displayVehiculeModal && <VehiculeInformationModal
            display={displayVehiculeModal ? true : false}
            vehicule={displayVehiculeModal}
            onClose={() => {
                setDisplayVehiculeModal(undefined);
            }}
            onValidate={async (_v) => {
                await props.dispatch(actions.set.selectedVehicule(_v));
                setDisplayVehiculeModal(undefined);
            }}
        />}

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
                tooltipTitle={intl.formatMessage({ id: 'vehicules.add' })}
                onClick={async () => {
                    setDisplayVehiculeAddModal(true);
                }}
            />
        </SpeedDial>

    </Box>
}
export default withSnackBar(withStoreProvider(injectIntl(VehiculesPage)));