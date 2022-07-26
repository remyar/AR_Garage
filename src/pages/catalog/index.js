import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';
import actions from '../../actions';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Loader from '../../components/Loader';
import CatalogSelectVehicule from '../../components/CatalogSelectVehicule';
import CatalogueTreeView from '../../components/CatalogueTreeView';
import CatalogFilter from '../../components/CatalogFilter';

import Typography from '@mui/material/Typography';
import CatalogProductDetails from '../../components/CatalogProductDetails';

function CatalogPage(props) {
    const intl = props.intl;
    const selectedVehicule = props.globalState.selectedVehicule;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [catalog, setCatalog] = useState([]);
    const [carCatalog, setCarCatalog] = useState({});

    const [articles, setArticles] = useState([]);
    const [filter, setFilter] = useState({});

    const [displayProductDetails, setDisplayProductDetails] = useState(false);

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.tecdoc.getChildNodesAllLinkingTarget(selectedVehicule.carId));
            setCatalog(result.catalog);
        } catch (err) {
            props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
        }
        finally {
            setDisplayLoader(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    let rows = articles.filter((el) => el.mfrName?.toLowerCase().startsWith(filter?.brand ? filter?.brand?.toLowerCase() : ""));

    return <Box sx={{ paddingBottom: '25px' }}>
        <Loader display={displayLoader} />

        <CatalogSelectVehicule
            selectedVehicule={selectedVehicule}
            onChange={(car) => {
                setCarCatalog(car)
            }}
        />

        <CatalogFilter
            articles={articles}
            onChange={(obj) => {
                setFilter({ ...filter, ...obj });
            }}
        />

        <CatalogProductDetails
            display={displayProductDetails}
            onClose={() => { setDisplayProductDetails(false); }}
        />

        <Grid container spacing={2} sx={{ paddingTop: '25px' }}>
            <Grid item xs={4}>
                <CatalogueTreeView
                    catalog={catalog}
                    onClick={async (c) => {
                        if (c.hasChilds == false && c.hasArticles == true) {
                            setDisplayLoader(true);
                            try {
                                let result = await props.dispatch(actions.tecdoc.getArticleIdsWithState(carCatalog.carId, c.assemblyGroupNodeId));
                                setArticles(result.articlesWithState);
                            } catch (err) {
                                props.snackbar.error(intl.formatMessage({ id: 'fetch.error' }));
                            }
                            finally {
                                setDisplayLoader(false);
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={8} sx={{ textAlign: 'center' }}>
                {rows.map((article => {
                    return <Box>
                        <Grid container spacing={2} sx={{ paddingTop: '25px' , cursor : 'pointer' }} onClick={() => {
                            setDisplayProductDetails(true);
                        }}>

                            <Grid item xs={2}>
                                {(() => {
                                    if (article?.images && article?.images[0] && article?.images[0].imageURL100) {
                                        let thumbNail = article.images[0].imageURL100;
                                        return <img src={thumbNail} />
                                    } else {
                                        return <img width={100} src={"/no-image-available.jpg"} />
                                    }
                                })()}
                            </Grid>
                            <Grid item xs={10} sx={{ textAlign: 'left' }}>
                                <b>{article.mfrName + " - " + article.articleNumber + (article.misc?.additionalDescription ? (" - " + article.misc?.additionalDescription) : "")}</b>
                                <br />
                                {article.genericArticles[0].genericArticleDescription}
                                <Typography variant="caption" display="block" gutterBottom>
                                    {article?.linkages?.map((linkage) => linkage.linkageCriteria?.map((criteria) => " " + criteria.criteriaDescription + " : " + criteria?.formattedValue + " ")).join(",")}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {article.articleCriteria.map((criteria) => " " + criteria.criteriaDescription + " : " + criteria.formattedValue + " ").join(",")}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>;
                }))}
            </Grid >
        </Grid >
    </Box >;
}

export default withNavigation(withStoreProvider(withSnackBar(injectIntl(CatalogPage))));