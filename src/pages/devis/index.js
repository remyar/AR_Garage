import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';

import actions from '../../actions';

import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import SearchComponent from '../../components/Search';
import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';
import ChangeDateModal from '../../components/ChangeDateModal';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';

import routeMdw from '../../middleware/route';

import NewReleasesIcon from '@mui/icons-material/NewReleases';
import Tooltip from '@mui/material/Tooltip';
import VerifiedIcon from '@mui/icons-material/Verified';
import CreditScoreIcon from '@mui/icons-material/CreditScore';

function DevisPage(props) {
    const intl = props.intl;
    const globalState = props.globalState;

    const [displayChangeDateModal, setDisplayChangeDateModal] = useState(undefined);
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
        { id: 'total', label: 'Total', minWidth: 100 },
        {
            id: 'emission', label: intl.formatMessage({ id: 'Date.emission' }), minWidth: 100, render: (row) => {

                return <span onClick={(e) => {
                    e.stopPropagation();
                }}>
                    {row.emission.toLocaleDateString()}
                    {globalState.settings?.tempSettings?.godMode && <EditIcon key={"editDevis_" + row.devis_number} sx={{ cursor: 'pointer', marginLeft: '5px', paddingTop: '10px' }} onClick={(e) => {
                        e.stopPropagation();
                        setDisplayChangeDateModal(row.devis_number);
                    }} />}

                </span>
            }
        },
        { id: 'expiration', label: intl.formatMessage({ id: 'Date.expiration' }), minWidth: 100 },
        {
            label: '', maxWidth: 100, minWidth: 100, align: "right", render: (row) => {
                return <span>
                    {row.isPending && <Tooltip title="Devis en cours">
                        <NewReleasesIcon key={"pendingDevis_" + row.devis_number} sx={{ color: "orange", position: "relative", top: '5px', }} />
                    </Tooltip>}
                    {row?.isPending == false && <Tooltip title="Devis prét">
                        <VerifiedIcon key={"pendingDevis_" + row.devis_number} sx={{ color: "green", position: "relative", top: '5px', }} />
                    </Tooltip>}
                    <Tooltip title={"Facturé : " + (row.facture_id ? "oui" : "non")}>
                        <CreditScoreIcon color={row.facture_id ? "" : "disabled"} key={"pendingDevis_" + row.devis_number} sx={{ position: "relative", top: '5px', marginLeft: '10px' }} />
                    </Tooltip>
                </span>
            }
        }
    ];

    let rows = devis.map((el) => {

        return {
            devis_number: el.id,
            plate: el.vehicule?.plate,
            kilometrage: el.vehicule?.kilometrage,
            isPending: el.isPending ? true : false,
            facture_id : el.facture_id,
            total: (el?.total?.toFixed(2) || "0.00") + ' €',
            client: el?.client?.nom + ' ' + el?.client?.prenom,
            emission: (el.date ? new Date(el.date) : new Date()),
            expiration: (el.expiration ? new Date(el.expiration) : new Date()).toLocaleDateString(),
            onClick: () => {
                if (el.isPending) {
                    props.navigation.push(routeMdw.urlDevisEdit(el.id));
                } else {
                    props.navigation.push(routeMdw.urlDevisDisplay(el?.id));
                }
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

        <ChangeDateModal
            title={intl.formatMessage({ id: 'Date.emission' })}
            display={displayChangeDateModal != undefined}
            value={devis.find((el) => el.id == displayChangeDateModal)?.date}
            onValid={async (value) => {
                let devi = devis.find((el) => el.id == displayChangeDateModal)
                devi.date = value.getTime();
                devi.expiration = value.addMonths(1);
                try {
                    await props.dispatch(actions.set.saveDevis(devi));
                    props.snackbar.success('devis.save.success');
                    setDisplayChangeDateModal(undefined);
                } catch (err) {
                    props.snackbar.error('devis.save.error');
                }
            }}
            onClose={() => {
                setDisplayChangeDateModal(undefined);
            }}
        />

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <br /><br />
        <DataTable sx={{ height: (window.innerHeight - 200) + "px" }} headers={headers} rows={rows} />

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