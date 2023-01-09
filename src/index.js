import React from 'react';
import { createRoot } from 'react-dom/client';
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
    persist: false,
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

const root = createRoot(document.getElementById('root'));

root.render(
    <React.Fragment>
        <CssBaseline />
        <StoreProvider extra={{ api, electron }} persistConfig={persistConfig} globalState={{
            settings: { locale: "fr" , wizard : true },
            clients: [],
            vehicules: [],
            categories: [],
            devis: [],
            products: [],
            services: [],
            factures: [],
            marques: [],
            oem: []
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
    </React.Fragment>
);