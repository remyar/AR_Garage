import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';

import Modal from '../Modal';

import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import CloseIcon from '@mui/icons-material/Close';

function ImageViewer(props) {

    const intl = props.intl;

    const [modalSize, setModalSize] = useState({ width: 40, height: 40 });
    const [imageIsLoaded, setImageIsLoaded] = useState(false);

    const onImgLoad = ({ target: img }) => {
        const { naturalHeight, naturalWidth } = img;

        var maxWidth = window.innerWidth * 0.8; // Max width for the image
        var maxHeight = window.innerHeight * 0.8;    // Max height for the image
        var ratio = 0;  // Used for aspect ratio
        var width = naturalWidth;    // Current image width
        var height = naturalHeight;  // Current image height

        // Check if the current width is larger than the max
        if (width > maxWidth) {
            ratio = maxWidth / width;   // get ratio for scaling image
            height = height * ratio;    // Reset height to match scaled image
            width = width * ratio;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if (height > maxHeight) {
            ratio = maxHeight / height; // get ratio for scaling image
            width = width * ratio;    // Reset width to match scaled image
            height = height * ratio;    // Reset height to match scaled image
        }

        setTimeout(() => {
            setModalSize({ width: width, height: height });
            setImageIsLoaded(true);
        }, 500);

    };

    return <Modal display={props.display} sx={{ width: (modalSize.width + 64) + 'px', height: (modalSize.height + 64 + (imageIsLoaded ? 24 : 0)) + 'px' }}>
        <Paper elevation={0} >
            {imageIsLoaded && <Box >
                <Grid container spacing={0}>
                    <Grid item xs={2} />
                    <Grid item xs={8} sx={{ textAlign: "center" }} >
                        {props.title || ""}
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "end" }}>
                        <CloseIcon onClick={() => {
                            props.onClose && props.onClose();
                        }}
                            sx={{ cursor: "pointer" }}
                        />
                    </Grid>
                </Grid>
            </Box>}
            <Box>
                <img
                    style={{ display: imageIsLoaded ? "block" : "none" }}
                    onLoad={onImgLoad}
                    src={props.src}
                    width={modalSize.width}
                    height={modalSize.height}
                />
                {!imageIsLoaded && <CircularProgress />}
            </Box>
        </Paper>
    </Modal>
}

export default withNavigation(injectIntl(ImageViewer));