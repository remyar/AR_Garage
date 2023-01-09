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

import DataTable from '../../components/DataTable';
import SearchComponent from '../../components/Search';

import ClientAddModal from '../../components/ClientAddModal';
import ConfirmModal from '../../components/ConfirmModal';

import actions from '../../actions';
import Loader from '../../components/Loader';

function ClientsPage(props) {

    const intl = props.intl;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [displayConfirmModal, setDisplayConfirmModal] = useState(undefined);
    const [displayClientAddModal, setDisplayClientAddModal] = useState(false);
    const [displayClientEditModal, setDisplayClientEditModal] = useState(undefined);
    const [clients, setClients] = useState([]);
    const [filter, setFilter] = useState("");

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allClients());
            setClients(result.clients.filter(el => el.deleted !== 1));
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }

        setDisplayLoader(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const headers = [
        { id: 'nom', label: 'Nom', minWidth: 100 },
        { id: 'prenom', label: 'Prenom', minWidth: 100 },
        { id: 'telephone', label: 'Telephone', minWidth: 100 },
        { id: 'email', label: 'Email', minWidth: 100 },
        { id: 'code_postal', label: 'Code Postal', minWidth: 100 },
        { id: 'ville', label: 'Ville', minWidth: 100 },
        {
            label: '', maxWidth: 100, minWidth: 100, align: "right", render: (row) => {
                return <span>
                    <EditIcon sx={{ cursor: 'pointer' }} onClick={() => {
                        setDisplayClientEditModal(row);
                        setDisplayClientAddModal(true);
                    }} />
                    <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer', marginLeft: '15px' }} onClick={() => {
                        setDisplayConfirmModal(row);
                    }} />
                </span>
            }
        }
    ];

    let rows = [...clients];
    rows = rows.sort((a, b) => a.nom.toLowerCase() > b.nom.toLowerCase() ? -1 : 1);

    rows = rows.filter((el) => el.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(filter) || el.prenom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(filter))

    return <Box>

        <Loader display={displayLoader} />

        {displayConfirmModal && <ConfirmModal
            title={intl.formatMessage({ id: 'clients.delete' })}
            display={displayConfirmModal ? true : false}
            onClose={() => {
                setDisplayConfirmModal(undefined);
            }}
            onValidate={async (data) => {
                let idToDelete = displayConfirmModal.id;
                setDisplayLoader(true);
                setDisplayConfirmModal(undefined);
                try {
                    await props.dispatch(actions.del.client(idToDelete));
                    await fetchData();
                } catch (err) {
                    props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
                }
                setDisplayLoader(false);
            }}
        />}

        {displayClientAddModal && <ClientAddModal
            editClient={displayClientEditModal}
            display={displayClientAddModal}
            onClose={() => {
                setDisplayClientAddModal(undefined);
                setDisplayClientEditModal(undefined);
            }}
            onValidate={async (client, edit) => {
                setDisplayClientEditModal(undefined);
                setDisplayClientAddModal(undefined);
                try {
                    if (edit) {
                        await props.dispatch(actions.put.client(client));
                    } else {
                        await props.dispatch(actions.set.newClient(client));
                    }
                    await fetchData();
                } catch (err) {
                    props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
                }
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
                key={'NewClient'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'clients.add' })}
                onClick={async () => {
                    setDisplayClientAddModal(true);
                }}
            />
        </SpeedDial>

    </Box>
}


export default withSnackBar(withStoreProvider(injectIntl(ClientsPage)));