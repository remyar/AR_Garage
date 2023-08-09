import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import { withNavigation } from '../../providers/navigation';

import actions from '../../actions';

import Box from '@mui/material/Box';

import AddIcon from '@mui/icons-material/Add';
import BuildIcon from '@mui/icons-material/Build';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import ConfirmModal from '../../components/ConfirmModal';
import SearchComponent from '../../components/Search';
import DataTable from '../../components/DataTable';
import Loader from '../../components/Loader';

import VehiculeInformationModal from '../../components/VehiculeInformationsModal';
import VehiculeAddModal from '../../components/VehiculeAddModal';
import VehiculeAddManuallyModal from '../../components/VehiculeAddManuallyModal';
import VehiculeTechnicListModal from '../../components/VehiculeTechnicListModal';

import ImageViewer from '../../components/ImageViewer';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';

import routeMdw from '../../middleware/route';

function VehiculesPage(props) {
    const intl = props.intl;
    const globalState = props.globalState;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [vehicules, setVehicules] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState(undefined);
    const [displayConfirmModal, setDisplayConfirmModal] = useState(undefined);
    const [displaVehiculeAddModal, setDisplayVehiculeAddModal] = useState(false);
    const [displaVehiculeAddManuallyModal, setDisplayVehiculeAddManuallyModal] = useState(false);
    const [displayVehiculeTechnicModal, setDisplayVehiculeTechnicModal] = useState(undefined);
    const [displayVehiculeModal, setDisplayVehiculeModal] = useState(undefined);
    const [displayImageModal, setDisplayImageModal] = useState(undefined);
    const [filter, setFilter] = useState("");

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(undefined);
    };

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.get.allVehicules());
            setVehicules(result.vehicules.filter((el) => ((el.deleted !== 1) && (el.deleted !== true))));
        } catch (err) {
            props.snackbar.error('fetch.error');
        }
        setDisplayLoader(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const headers = [
        { id: 'plate', label: 'Plaque', minWidth: 100 },
        {
            id: 'commercial_name', label: 'Modéle', minWidth: 100, render: (row) => {
                return <span>{row.designation || ""} </span>
            }
        },
        {
            id: 'puissance', label: 'Puissance', minWidth: 100, render: (row) => {
                return <span>{(row.puissance || "") + " cv"}</span>
            }
        },
        {
            id: 'energie', label: 'Energie', minWidth: 100, render: (row) => {
                return <span>{row.energy || ""} </span>
            }
        },
        {
            id: 'engine_code', label: 'Code Moteur', minWidth: 100, render: (row) => {
                return <span>{row.engineCode || ""} </span>
            }
        },
        {
            label: '', maxWidth: 50, minWidth: 50, align: "right", render: (row) => {
                return <span>

                    {row.hasTechnics && <BuildIcon sx={{ cursor: 'pointer' }} onClick={() => {
                        setDisplayVehiculeTechnicModal(row);
                    }} />}

                    {globalState.settings.useCatalog && <MenuBookIcon sx={{ cursor: 'pointer', marginLeft: '15px' }} onClick={async () => {
                        try {
                            await props.dispatch(actions.set.selectedVehicule(row));
                            props.navigation.push(routeMdw.urlCatalog());
                        } catch (err) {
                            props.snackbar.error('vehicule.no.catalog');
                        }
                    }} />}

                    <InfoIcon sx={{ cursor: 'pointer', marginLeft: '15px' }} onClick={() => {
                        setDisplayVehiculeModal(row);
                    }} />

                    <MenuIcon sx={{ cursor: 'pointer', marginLeft: '15px' }} onClick={(event) => {
                        setSelectedVehicule(row);
                        handleClick(event);
                    }} />

                </span>
            }
        }
    ];

    let rows = vehicules.map((_v) => {
        return {
            ..._v
        }
    })

    rows = rows.sort((a, b) => (a.plate?.toLowerCase() > b.plate?.toLowerCase()) ? 1 : -1);

    rows = rows.filter((el) => el.plate?.toLowerCase().startsWith(filter));

    return <Box sx={{ paddingBottom: '25px' }}>

        <Loader display={displayLoader} />

        {displayConfirmModal && <ConfirmModal
            title={"Supprimer le véhicule ?"}
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
                try {
                    await props.dispatch(actions.set.selectedVehicule(_v));
                } catch (err) {
                    props.snackbar.error(err.message);
                }
                setDisplayVehiculeModal(undefined);
            }}
        />}

        {displaVehiculeAddModal && <VehiculeAddModal
            display={displaVehiculeAddModal ? true : false}
            onClose={() => {
                setDisplayVehiculeAddModal(undefined);
            }}
            onValidate={async (_v) => {
                setDisplayVehiculeAddModal(false);
                setDisplayLoader(true);
                try {
                    let result = await props.dispatch(actions.get.autoFromPlate(_v.plate));
                    await fetchData();
                    setDisplayVehiculeModal(result.vehicule);
                } catch (err) {
                    props.snackbar.error(err.message);
                }
                setDisplayLoader(false);
            }}
        />}

        {displaVehiculeAddManuallyModal && <VehiculeAddManuallyModal
            display={displaVehiculeAddManuallyModal ? true : false}
            onClose={() => {
                setDisplayVehiculeAddManuallyModal(undefined);
            }}
            onValidate={async (_v) => {
                setDisplayVehiculeAddManuallyModal(false);
                setDisplayLoader(true);
                try {
                    let tecdocVehicule = await props.dispatch(actions.get.vehicule(_v.tecdocId));
                    console.log(tecdocVehicule);
                    _v.puissance = tecdocVehicule?.vehicule?.puissance;
                    _v.engineCode = tecdocVehicule?.vehiculeIds?.motorCodes?.array && tecdocVehicule?.vehiculeIds?.motorCodes?.array[0].motorCode;
                    _v.energy = tecdocVehicule?.vehicule?.energy;

                    let result = await props.dispatch(actions.set.saveVehicule(_v));
                    await fetchData();
                    setDisplayVehiculeModal(result.vehicule);
                } catch (err) {
                    props.snackbar.error(err.message);
                }
                setDisplayLoader(false);
            }}
        />}

        {displayVehiculeTechnicModal && <VehiculeTechnicListModal
            onClose={() => {
                setDisplayVehiculeTechnicModal(undefined);
            }}
            display={displayVehiculeTechnicModal ? true : false}
            vehicule={displayVehiculeTechnicModal}
            onDisplayPicture={(link) => {
                setDisplayVehiculeTechnicModal(undefined);
                setDisplayImageModal(link);
                console.log(link);
            }}
        />}

        {displayImageModal && <ImageViewer
            display={displayImageModal ? true : false}
            src={displayImageModal}
            onClose={() => {
                setDisplayImageModal(undefined);
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
            <SpeedDialAction
                key={'ManuallyNewVehicule'}
                icon={<AddIcon />}
                tooltipTitle={intl.formatMessage({ id: 'vehicules.add.manually' })}
                onClick={async () => {
                    setDisplayVehiculeAddManuallyModal(true);
                }}
            />
        </SpeedDial>

        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={anchorEl ? true : false}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={(event) => {
                setDisplayConfirmModal(selectedVehicule);
                handleClose(event);
            }}>{intl.formatMessage({ id: 'vehicules.delete' })}</MenuItem>
        </Menu>
    </Box>
}
export default withNavigation(withSnackBar(withStoreProvider(injectIntl(VehiculesPage))));