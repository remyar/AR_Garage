import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { injectIntl } from 'react-intl';
import InputTextModal from "../InputTextModal";

function PasswordAsk(props) {

    const intl = props.intl;
    const title = props.title || "";
    const label = props.label || "";

    return <InputTextModal
        title={title}
        label={label}
        type="password"
        display={props.display ? true : false}
        onClose={() => { props.onClose && props.onClose() }}
        onValidate={(value) => { props.onValidate && props.onValidate(value == props.password) }}
    />
}

export default injectIntl(PasswordAsk);