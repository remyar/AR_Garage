import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import locales from '../../locales';

function MyDatePicker(props) {

    const [value, setValue] = useState(new Date());

    useEffect(() => {
        props.onChange && props.onChange(value);
    }, [value]);

    return <LocalizationProvider sx={{ ...props.sx }} dateAdapter={AdapterDateFns} adapterLocale={locales.getLocale()}>
        <DatePicker
            sx={{ ...props.sx }}
            disabled={props.disabled ? props.disabled : false}
            label={props.title || "Date échéance"}
            value={props.value || new Date().addMonths(1)}
            onChange={(newValue) => { setValue(new Date(newValue)) }}
        />
    </LocalizationProvider>
}

export default injectIntl(MyDatePicker)
