import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';
import Box from '@mui/material/Box';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import AddIcon from '@mui/icons-material/Add';

import ProductAddModal from '../../components/ProductAddModal/index';
import ConfirmModal from '../../components/ConfirmModal';

import DataTable from '../../components/DataTable';
import SearchComponent from '../../components/Search';

import actions from '../../actions';
import Loader from '../../components/Loader';


function ProduitsPage(props) {
    const intl = props.intl;
    const selectedVehicule = props.globalState.selectedVehicule;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [produits, setProduits] = useState([]);
    const [displayConfirmModal, setDisplayConfirmModal] = useState(undefined);
    const [displayProductAddModal, setDisplayProductAddModal] = useState(false);
    const [displayProductEditModal, setDisplayProductEditModal] = useState(undefined);

    const [filter, setFilter] = useState("");

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allProducts());
            setProduits(result.products.filter((el) => ((el.deleted !== 1) && (el.deleted !== true))));
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
                    {/*<EditIcon sx={{ cursor: 'pointer' }} onClick={() => {
                        setDisplayProductEditModal(row);
                        setDisplayProductAddModal(true);
                    }} />*/}
                    <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer', marginLeft: '15px' }} onClick={() => {
                        setDisplayConfirmModal(row);
                    }} />
                </span>
            }
        }
    ];

    let rows = [...produits];

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
                await props.dispatch(actions.del.product(idToDelete));
                await fetchData();
                setDisplayLoader(false);
            }}
        />}

        {displayProductAddModal && <ProductAddModal
            editProduct={displayProductEditModal}
            display={displayProductAddModal}
            onClose={() => {
                setDisplayProductAddModal(false);
                setDisplayProductEditModal(undefined);
            }}
            onValidate={async (product, edit) => {
                setDisplayLoader(true);
                setDisplayProductAddModal(false);

                try {
                    await props.dispatch(actions.set.saveProduct(product));
                    await fetchData();
                } catch (err) {

                }

                setDisplayProductEditModal(undefined);
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
                key={'NewProduct'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'products.add' })}
                onClick={async () => {
                    setDisplayProductAddModal(true);
                }}
            />
        </SpeedDial>

    </Box>;
}

export default withStoreProvider(withSnackBar(injectIntl(ProduitsPage)));