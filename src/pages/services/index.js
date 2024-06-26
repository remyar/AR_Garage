import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';
import Box from '@mui/material/Box';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

import AddIcon from '@mui/icons-material/Add';

import ServiceAddModal from '../../components/ServiceAddModal';
import ConfirmModal from '../../components/ConfirmModal';

import DataTable from '../../components/DataTable';
import SearchComponent from '../../components/Search';

import actions from '../../actions';
import Loader from '../../components/Loader';


function ServicesPage(props) {
    const intl = props.intl;
    const selectedVehicule = props.globalState.selectedVehicule;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [services, setServices] = useState([]);
    const [displayConfirmModal, setDisplayConfirmModal] = useState(undefined);
    const [displayServiceAddModal, setDisplayServiceAddModal] = useState(false);
    const [displayServiceEditModal, setDisplayServiceEditModal] = useState(undefined);

    const [filter, setFilter] = useState("");

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allServices());
            result.services = result.services.sort((a, b) => a.ref_fab > b.ref_fab ? 1 : -1);
            setServices(result.services.filter((el) => ((el.deleted !== 1) && (el.deleted !== true))));
        } catch (err) {
            props.snackbar.error(err.message);
        }
        setDisplayLoader(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const headers = [
        { id: 'ref_fab', label: 'Référence', minWidth: 100 },
        { id: 'nom', label: 'Désignation', minWidth: 100 },
        {
            label: '', maxWidth: 100, minWidth: 100, align: "right", render: (row) => {
                return <span>
                    <EditIcon sx={{ cursor: 'pointer' }} onClick={() => {
                        setDisplayServiceAddModal(true);
                        setDisplayServiceEditModal(row);
                    }} />
                    <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer', marginLeft: '15px' }} onClick={() => {
                        setDisplayConfirmModal(row);
                    }} />
                </span>
            }
        }
    ];

    let rows = [...services];
    rows = rows.sort((a, b) => a.id > b.id ? -1 : 1);
    rows = rows.filter((el) => el.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter) || el.ref_fab.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter))

    return <Box>

        <Loader display={displayLoader} />

        {displayConfirmModal && <ConfirmModal
            title={intl.formatMessage({ id: 'products.delete' })}
            display={displayConfirmModal ? true : false}
            onClose={() => {
                setDisplayConfirmModal(undefined);
            }}
            onValidate={async (data) => {
                let idToDelete = displayConfirmModal.id;
                setDisplayLoader(true);
                setDisplayConfirmModal(undefined);
                await props.dispatch(actions.del.service(idToDelete));
                await fetchData();
                setDisplayLoader(false);
            }}
        />}

        {displayServiceAddModal && <ServiceAddModal
            editService={displayServiceEditModal}
            display={displayServiceAddModal}
            onClose={() => {
                setDisplayServiceAddModal(false);
                setDisplayServiceEditModal(undefined);
            }}
            onValidate={async (service, edit) => {
                setDisplayLoader(true);
                setDisplayServiceAddModal(false);

                try {
                    await props.dispatch(actions.set.saveService(service));
                    await fetchData();
                } catch (err) {

                }

                setDisplayLoader(false);
                setDisplayServiceEditModal(undefined);
            }}
        />}

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <br />
        <br />
        <DataTable sx={{ height: (window.innerHeight - 200) + "px" }} headers={headers} rows={rows} />

        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction
                key={'NewService'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'service.add' })}
                onClick={async () => {
                    setDisplayServiceAddModal(true);
                }}
            />
        </SpeedDial>

    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(ServicesPage)));