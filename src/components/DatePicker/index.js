import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import locales from '../../locales';

function MyDatePicker(props) {

    const [value, setValue] = React.useState(new Date().addMonths(1));

    useEffect(() => {
        props.onChange && props.onChange(value);
    }, [value]);

    return <LocalizationProvider sx={{...props.sx}} dateAdapter={AdapterDateFns} locale={locales.getLocale()}>
        <DatePicker
            sx={{...props.sx}}
            disabled={props.disabled ? props.disabled : false}
            label="Date échéance"
            value={value}
            onChange={(newValue) => {
                setValue(new Date(newValue));
                
            }}
            renderInput={(params) => <TextField {...params} sx={{...props.sx}}/>}
        />
    </LocalizationProvider>
}

export default injectIntl(MyDatePicker)
