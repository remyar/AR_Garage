import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { injectIntl } from 'react-intl';
import InputMask from 'react-input-mask';

function PlaqueValue(props) {

    const intl = props.intl;
    const value = props.value || "";

    const [plaque, setPlaque] = useState(value);

    useEffect(() => {
        if (plaque.length >= "AA-456-BB".length) {
            props.onChange && props.onChange(plaque.toUpperCase());
        }
    }, [plaque]);

    return <InputMask value={plaque} mask="aa-999-aa" maskChar="*" alwaysShowMask={false} onChange={(event) => {
        setPlaque(event.target.value.toUpperCase());
    }}>
        {(inputProps) => <TextField label="AA-456-BB" variant="outlined" sx={{ width: "100%", textAlign: "center" }} disableUnderline />}
    </InputMask>
}

export default injectIntl(PlaqueValue);