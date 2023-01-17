import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import { withSnackBar } from '../../providers/snackBar';

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

function CatalogueTreeView(props) {
    const catalog = props.catalog || [];

    let _catalog = [];

    function _constructTree(cat){
        return <TreeItem nodeId={cat.tecdocId} label={cat.nom} onClick={() => props.onClick && props.onClick(cat)} disabled={cat.hasArticles ? false : true}>
            {(()=>{
                if ( cat.hasChilds == true ){
                    let __c = catalog.map((c) => c.parent_id == cat.tecdocId ? c : undefined).filter((el) => el != undefined);
                    return __c.map((___c) => _constructTree(___c));  
                }
            })()}
        </TreeItem>
    }

    catalog.forEach((c) => {
        if ( c.parent_id == undefined ){
            //-- root
            _catalog.push(_constructTree(c));
        }
    });

    return <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: "80%", flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
        {_catalog}

    </TreeView>
}

export default withNavigation(withStoreProvider(withSnackBar(injectIntl(CatalogueTreeView))));