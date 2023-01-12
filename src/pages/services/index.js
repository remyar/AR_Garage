import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';
import Box from '@mui/material/Box';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import ProductAddModal from '../../components/ProductAddModal';
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
    const [displayProductEditModal, setDisplayProductEditModal] = useState(undefined);

    const [filter, setFilter] = useState("");

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allServices());
            setServices(result.services.filter((el) => el.deleted !== 1));
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
        /*{
            id: 'prix_vente', label: "Prix vente", minWidth: 100, render: (value) => {
                return '' + parseFloat(value.prix_vente.replace(',', '.')).toFixed(2) + ' €';
            }
        },*/
        {
            label: '', maxWidth: 100, minWidth: 100, align: "right" , render: (row) => {
                return <span>
                    <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer', marginLeft: '15px' }} onClick={() => {
                        setDisplayConfirmModal(row);
                    }} />
                </span>
            }
        }
    ];

    let rows = [...services];

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
            editClient={displayProductEditModal}
            display={displayServiceAddModal}
            onClose={() => {
                setDisplayServiceAddModal(false);
            }}
            onValidate={async (service, edit) => {
                setDisplayLoader(true);
                setDisplayServiceAddModal(false);

                await props.dispatch(actions.set.newService(service));
                await fetchData();
                
                setDisplayLoader(false);
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
                key={'NewService'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'service.add' })}
                onClick={async () => {
                    //if (selectedVehicule) {
                        setDisplayServiceAddModal(true);
                    /*} else {
                        props.snackbar.error(intl.formatMessage({ id: 'no.vehicule.selected' }));
                    }*/
                }}
            />
        </SpeedDial>

    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(ServicesPage)));