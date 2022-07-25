import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';

import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

function CatalogFilter(props) {
    const articles = props.articles || [];

    let brands = [];

    articles.forEach((article) => {
        if (brands.find((b) => b == article.mfrName) == undefined) {
            brands.push(article.mfrName);
        }
    });

    return <Box sx={{paddingTop : '25px'}}>
        <Grid container spacing={2}>
            <Grid item xs={4} sx={{ textAlign: 'center' }}>
            <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={brands}
                    sx={{ width: '100%' }}
                    onChange={(event, value) => { props.onChange &&  props.onChange({ brand : value}) }}
                    renderInput={(params, option) => <TextField {...params} label="Construteurs" variant="outlined" sx={{ width: "100%", textAlign: "center" }} name="Construteurs" />}
                />
            </Grid>
        </Grid>
    </Box>;
}

export default withNavigation(withStoreProvider(withSnackBar(injectIntl(CatalogFilter))));