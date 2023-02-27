import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { injectIntl } from 'react-intl';
import InputMask from 'react-input-mask';

function PlaqueValue(props) {

    const intl = props.intl;
    const value = props.value || "";

    const [plaque, setPlaque] = useState(value);
    const [mask, setMask] = useState("*a-999-aa")

    useEffect(() => {
        if (plaque.replace('-', '').charAt(0) >= '0' && plaque.replace('-', '').charAt(0) <= '9') {
            if (plaque.replace('-', '').charAt(1) >= '0' && plaque.replace('-', '').charAt(1) <= '9') {
                if (plaque.replace('-', '').charAt(2) >= '0' && plaque.replace('-', '').charAt(2) <= '9') {
                    if (plaque.replace('-', '').charAt(3) >= '0' && plaque.replace('-', '').charAt(3) <= '9') {
                        setMask("9999-aa-99");
                    }else{
                        setMask("999-*a-99");
                    }
                } else {
                    setMask("99-*a-99");
                }
            } else {
                setMask("9-*a-99");
            }
        }
        else {
            setMask("*a-999-aa");
        }
        if (plaque.length >= mask.length) {
            props.onChange && props.onChange(plaque.toUpperCase());
        }
    }, [plaque]);

    if (plaque.length > 0) {

    }

    return <InputMask value={plaque} mask={mask} maskChar="*" alwaysShowMask={false} onChange={(event) => {
        setPlaque(event.target.value.toUpperCase());
    }}>
        {(inputProps) => <TextField label={mask} variant="outlined" sx={{ width: "100%", textAlign: "center" }} disableUnderline />}
    </InputMask>

}

export default injectIntl(PlaqueValue);