import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';
import { withNavigation } from '../../providers/navigation';
import { useParams } from "react-router-dom";

import actions from '../../actions';

import DataTable from '../../components/DataTable';

import SearchComponent from '../../components/Search';
import Box from '@mui/material/Box';
import Loader from '../../components/Loader';

import routeMdw from '../../middleware/route';

function ModelSeries(props) {

    let params = useParams();
    params.id = parseInt(params.id);

    const [displayLoader, setDisplayLoader] = useState(false);
    const [manufacturer, setManufacturer] = useState(undefined);
    const [modelSeries, setModelSeries] = useState([]);
    const [selectedModel, setSelectedModel] = useState(undefined);
    const [motors, setMotors] = useState([]);
    const [filter, setFilter] = useState("");

    const selectedVehicule = props.globalState.selectedVehicule;

    async function fetchData() {
        setDisplayLoader(true);
        try {

            if (selectedVehicule) {
                let result = (await props.dispatch(actions.technics.getModelByTecdocId(selectedVehicule.tecdocId)))?.model || undefined;
                props.navigation.push(routeMdw.urlTechnicsAdjustments(result.type_id));
            }
            else {
                let result = await props.dispatch(actions.technics.getModelSeries(params.id));
                setModelSeries(result.modelSeries);

                result = await props.dispatch(actions.technics.getManufacturerById(params.id));
                setManufacturer(result.manufacturer);

                if (selectedModel) {
                    result = await props.dispatch(actions.technics.getMotorByModelId(selectedModel?.model_id));
                    setMotors(result.motors);
                }
            }
        } catch (err) {
            props.snackbar.error('fetch.error');
        }
        setDisplayLoader(false);
    }

    useEffect(() => {
        fetchData();
    }, [selectedModel]);

    const headersModel = [
        {
            id: 'description', label: 'Modéle', minWidth: 100, render: (row) => {
                return <span>{manufacturer?.make_name || ""} - {(row?.description + " " + (row?.additional_info ? row?.additional_info : "") + " ") || ""} {row.model_code ? "(" + row.model_code + ")" : ""}</span>
            }
        },
        {
            id: 'from', label: 'Année modéle', minWidth: 100, render: (row) => {
                return <span>{row.build_from == '0' ? "..." : row.build_from} - {row.build_to == '0' ? "..." : row.build_to}</span>
            }
        },
    ];

    let models = modelSeries.map((_v) => {
        return {
            ..._v,
            onClick: (row) => {
                setSelectedModel(row);
            }
        }
    })

    models = models.sort((a, b) => (a.description?.toLowerCase() > b.description?.toLowerCase()) ? 1 : -1);

    //models = models.filter((el) => el.model_used == 1);

    models = models.filter((el) => el.description?.toLowerCase().startsWith(filter));

    const headersSelected = [
        {
            id: 'description', label: 'Modéle', minWidth: 100, render: (row) => {
                return <span>{selectedModel?.description + " " + (selectedModel?.additional_info ? selectedModel?.additional_info : "") + " (" + selectedModel?.model_code + ")"} - {row.description}</span>
            }
        },
        {
            id: 'from', label: 'Année modéle', minWidth: 100, render: (row) => {
                return <span>{row.build_from == '0' ? "..." : row.build_from} - {(row.build_to == '0' || row.build_to == ' ') ? "..." : row.build_to}</span>
            }
        },
        ,
        {
            id: 'enginecode', label: 'Code Moteur', minWidth: 100, render: (row) => {
                return <span>{row.enginecode}</span>
            }
        }
        ,
        {
            id: 'cylindre', label: 'Cylindrée', minWidth: 100, render: (row) => {
                return <span>{row.capacity + " cc"}</span>
            }
        }
        ,
        {
            id: 'puissancekw', label: 'Puissance kW', minWidth: 100, render: (row) => {
                return <span>{row.output + " kW"}</span>
            }
        }
        ,
        {
            id: 'puissancecv', label: 'Puissance cv', minWidth: 100, render: (row) => {
                return <span>{(row.output * 1.36).toFixed(0) + " cv"}</span>
            }
        }
    ];

    let motorsList = motors.map((_v) => {
        return {
            ..._v,
            onClick: (row) => {
                props.navigation.push(routeMdw.urlTechnicsAdjustments(row.type_id));
            }
        }
    })

    motorsList = motorsList.sort((a, b) => (a.description?.toLowerCase() > b.description?.toLowerCase()) ? 1 : -1);

    return <Box sx={{ paddingBottom: '25px', overflow: 'hidden' }}>

        <Loader display={displayLoader} />

        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />

        <br />
        <br />
        <DataTable sx={{ height: ((window.innerHeight - 210) / 2) + "px" }} headers={headersModel} rows={models} />
        <br />
        <DataTable sx={{ height: ((window.innerHeight - 210) / 2) + "px" }} headers={headersSelected} rows={motorsList} />

    </Box>
}

export default withNavigation(withSnackBar(withStoreProvider(injectIntl(ModelSeries))));