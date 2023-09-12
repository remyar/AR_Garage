import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';
import actions from '../../actions';

import routeMdw from '../../middleware/route';

import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';


import SearchComponent from '../../components/Search';
import Loader from '../../components/Loader';
import DataTable from '../../components/DataTable';
import ChangeDateModal from '../../components/ChangeDateModal';

import NewReleasesIcon from '@mui/icons-material/NewReleases';
import Tooltip from '@mui/material/Tooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

function Billingspage(props) {
    const intl = props.intl;
    const globalState = props.globalState;

    const [displayChangeDateModal, setDisplayChangeDateModal] = useState(undefined);
    const [displayLoader, setDisplayLoader] = useState(false);
    const [filter, setFilter] = useState("");
    const [factures, setFactures] = useState([]);

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allFactures());
            setFactures(result.factures);
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        } finally {
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
        {
            id: 'emission', label: 'Date emission', minWidth: 100, render: (row) => {
                return <span onClick={(e) => {
                    e.stopPropagation();
                }}>
                    {row.emission.toLocaleDateString()}
                    {globalState.settings?.tempSettings?.godMode && <EditIcon key={"editFacture_" + row.facture_number} sx={{ cursor: 'pointer', marginLeft: '5px', paddingTop: '10px' }} onClick={(e) => {
                        e.stopPropagation();
                        setDisplayChangeDateModal(row.facture_number);
                    }} />}
                </span>
            }
        },
        {
            label: '', maxWidth: 100, minWidth: 100, align: "right", render: (row) => {
                return <span>
                    {!row.paye && <Tooltip title="En attente de paiement">
                        <NewReleasesIcon key={"pendingBill_" + row.facture_number} sx={{ color: "orange", position: "relative", top: '5px', }} />
                    </Tooltip>}
                    {row.paye && <Tooltip title="Payé">
                        <VerifiedIcon key={"pendingBill_" + row.facture_number} sx={{ color: "green", position: "relative", top: '5px', }} />
                    </Tooltip>}
                </span>
            }
        }
    ];

    let rows = factures.map((el) => {

        return {
            facture_number: el.id,
            plate: el?.vehicule?.plate || "",
            paye : el.paye ? true : false,
            kilometrage: el?.vehicule?.kilometrage,
            total: el?.total?.toFixed(2) + ' €',
            client: el?.client?.nom + ' ' + el?.client?.prenom,
            emission: (el?.date ? new Date(el?.date) : new Date()),
            onClick: () => {
                props.navigation.push(routeMdw.urlBillingDisplay(el.id));
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

        <ChangeDateModal
            display={displayChangeDateModal != undefined}
            value={factures.find((el) => el.id == displayChangeDateModal)?.date}
            onValid={async (value) => {
                let facture = factures.find((el) => el.id == displayChangeDateModal)
                facture.date = value.getTime();
                try {
                    await props.dispatch(actions.set.saveFacture(facture));
                    props.snackbar.success('facture.save.success');
                    setDisplayChangeDateModal(undefined);
                } catch (err) {
                    props.snackbar.error('facture.save.error');
                }
            }}
            onClose={() => {
                setDisplayChangeDateModal(undefined);
            }}
        />

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <DataTable sx={{ marginTop: '25px' }} headers={headers} rows={rows}>

        </DataTable>

    </Box>;
}

export default withSnackBar(withNavigation(withStoreProvider(injectIntl(Billingspage))));