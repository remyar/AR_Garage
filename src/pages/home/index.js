import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Loader from '../../components/Loader';

import actions from '../../actions';

import CAChart from '../../components/CAChart';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

require("react-big-calendar/lib/css/react-big-calendar.css")


function HomePage(props) {

    const intl = props.intl;

    const vehicule = props.globalState.vehicule || {};
    const [displayLoader, setDisplayLoader] = useState(false);
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

    let ca = {};
    let caTotal = 0;

    factures.forEach((_f) => {
        let year = new Date(_f.date).getFullYear();
        let month = new Date(_f.date).getMonth();

        if (year == new Date().getFullYear()) {

            if (ca[year] == undefined) {
                ca[year] = {
                    service: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    product: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            }

            _f.products.forEach((_p) => {
                caTotal += (parseFloat(_p.prix_vente) * parseFloat(_p.quantity));

                if (_p.isService) {
                    ca[year].service[month] += (parseFloat(_p.prix_vente) * parseFloat(_p.quantity));
                } else {
                    ca[year].product[month] += (parseFloat(_p.prix_vente) * parseFloat(_p.quantity));
                }
            });
        }
    });


    return <Box>

        <Loader display={displayLoader} />

        <Box sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: "80%",
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        }}>

            <Grid container spacing={2}>
                <Grid item xs={3} sx={{ textAlign: 'center' }} />
                <Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <CAChart data={ca[new Date().getFullYear()]} title={"CA " + new Date().getFullYear() + " - " + caTotal.toFixed(2) + "€"} />
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }} />
                {/*<Grid item xs={6} sx={{ textAlign: 'center' }}>
                    <Calendar
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        showMultiDayTimes
                    />
    </Grid>*/}
            </Grid>

        </Box>
    </Box >

}

export default withStoreProvider(withSnackBar(withNavigation(injectIntl(HomePage))));