import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from "react-router-dom";
import NavigationProvider from './providers/navigation';
import StoreProvider from './providers/StoreProvider';
import SnackBarGenerator from './providers/snackBar';
import CssBaseline from '@mui/material/CssBaseline';
import api from "./api";

import utils from './utils';

// i18n datas
import localeData from './locales';

const electron = require('@electron/remote')


// WHITELIST
const persistConfig = {
    key: 'AutomotiveDatabase',
    persist: true,
    whitelist: [
        "settings",
        "categories",
        "clients",
        "vehicules",
        "devis",
        "products",
        "services",
        "factures",
        "marques"
    ]
};


// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

window.userLocale = language;

// Split locales with a region code
let languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

window.userLocaleWithoutRegionCode = languageWithoutRegionCode;
localeData.setLocale(languageWithoutRegionCode);
// Try full locale, try locale without region code, fallback to 'en'
const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <StoreProvider extra={{ api , electron }} persistConfig={persistConfig} globalState={{
            settings: { locale: "fr" },
            clients: [],
            vehicules: [],
            categories:[],
            devis:[],
            products:[],
            services:[],
            factures:[],
            marques:[]
        }}>
            <MemoryRouter>
                <NavigationProvider>
                    <IntlProvider locale={language} messages={messages}>
                        <SnackBarGenerator>
                            <App />
                        </SnackBarGenerator>
                    </IntlProvider>
                </NavigationProvider>
            </MemoryRouter>
        </StoreProvider>
    </React.StrictMode>,
    document.getElementById('root')
);