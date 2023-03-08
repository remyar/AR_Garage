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

import ProductAddModal from '../../components/ProductAddModal';

function CatalogPage(props) {
    const intl = props.intl;
    const selectedVehicule = props.globalState.selectedVehicule;

    const [displayLoader, setDisplayLoader] = useState(false);
    const [catalog, setCatalog] = useState([]);
    const [carCatalog, setCarCatalog] = useState({});
    const [selectedCategorie, setSelectedCategorie] = useState({});

    const [articles, setArticles] = useState([]);
    const [filter, setFilter] = useState({});

    const [displayProductDetails, setDisplayProductDetails] = useState(undefined);
    const [displayProductAddModal, setDisplayProductAddModal] = useState(undefined);

    async function fetchData() {
        setDisplayLoader(true);
        try {
            let result = await props.dispatch(actions.tecdoc.getChildNodesAllLinkingTarget(selectedVehicule?.tecdocId));
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

    let rows = articles.filter((el) => el.brandName?.toLowerCase().startsWith(filter?.brand ? filter?.brand?.toLowerCase() : ""));

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
            display={displayProductDetails ? true : false}
            product={displayProductDetails}
            onClose={() => { setDisplayProductDetails(undefined); }}
            onValidate={(product) => {
                setDisplayProductDetails(undefined);
                setDisplayProductAddModal(product);
            }}
        />

        {displayProductAddModal && <ProductAddModal
            tecdocproduct={displayProductAddModal}
            categorie={selectedCategorie}
            display={displayProductAddModal ? true : false}
            onValidate={async (product) => {
                setDisplayLoader(true);
                if (displayProductAddModal?.oenNumbers?.array?.length > 0) {
                    for (let oem of displayProductAddModal?.oenNumbers?.array) {

                        product.ref_oem = oem.oeNumber;

                        try {
                            await props.dispatch(actions.set.newProduct(product));
                            await props.dispatch(actions.set.oemProduct({ carId: selectedVehicule.id, ref_oem: product.ref_oem }));
                        } catch (err) {
                            props.snackbar.error(intl.formatMessage({ id: 'save.error' }));
                        }
                    }
                } else {
                    try {
                        await props.dispatch(actions.set.newProduct(product));
                    } catch (err) {
                        props.snackbar.error(intl.formatMessage({ id: 'save.error' }));
                    }
                }

                setDisplayLoader(false);
                setDisplayProductAddModal(undefined);
                
            }}
            onClose={() => {
                setDisplayProductAddModal(undefined);
            }}
        />}

        <Grid container spacing={2} sx={{ paddingTop: '25px' }}>
            <Grid item xs={4}>
                <CatalogueTreeView
                    catalog={catalog}
                    onClick={async (c) => {
                        if (c.hasChilds == false && c.hasArticles == true) {
                            setDisplayLoader(true);
                            setSelectedCategorie(c);
                            try {
                                let result = await props.dispatch(actions.tecdoc.getArticleIdsWithState(selectedVehicule.tecdocId, c.assemblyGroupNodeId));
                                setArticles(result.articlesWithState);
                            } catch (err) {
                                props.snackbar.error('fetch.error');
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
                        <Grid container spacing={2} sx={{ paddingTop: '25px', cursor: 'pointer' }} onClick={() => {
                            setDisplayProductDetails(article);
                        }}>
                            <Grid item xs={3}>
                                {(() => {
                                    if (article?.articleThumbnails?.array && (article?.articleThumbnails?.array.length > 0) && article?.articleThumbnails?.array[0].document && article?.articleThumbnails?.array[0].document.length > 0) {
                                        return article?.articleThumbnails?.array && article?.articleThumbnails?.array[0].document && <img width={150} src={"data:image/png;base64, " + article?.articleThumbnails?.array[0].document} />
                                    } else {
                                        return <img width={150} src={"./no-image-available.jpg"} />
                                    }
                                })()}
                            </Grid>
                            <Grid item xs={9} sx={{ textAlign: 'left' }}>
                                <b>{article?.brandName + " - " + article?.articleNo + " - " + article?.directArticle?.articleName || ""}</b>
                                <br />
                                {/* {article.genericArticles[0].genericArticleDescription}
                                <Typography variant="caption" display="block" gutterBottom>
                                    {article?.linkages?.map((linkage) => linkage.linkageCriteria?.map((criteria) => " " + criteria.criteriaDescription + " : " + criteria?.formattedValue + " ")).join(",")}
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {article.articleCriteria.map((criteria) => " " + criteria.criteriaDescription + " : " + criteria.formattedValue + " ").join(",")}
                                </Typography>
                            */}
                            </Grid>
                        </Grid>
                    </Box>;
                }))}
            </Grid >
        </Grid >
    </Box >;
}

export default withNavigation(withStoreProvider(withSnackBar(injectIntl(CatalogPage))));