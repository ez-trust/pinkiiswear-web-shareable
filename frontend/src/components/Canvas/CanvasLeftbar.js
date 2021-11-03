import React from 'react';
import { connect } from 'react-redux';
import {
    Drawer,
    IconButton,
    Tooltip,
    makeStyles,
    Popover,
    ButtonBase
} from '@material-ui/core';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import WallpaperOutlinedIcon from '@material-ui/icons/WallpaperOutlined';
import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useCoreHandler } from './handlers';
import {
    addFabricObject,
    updateFabricCanvas
} from '../../redux/common/actions';
import { stickerItems } from './constants/constants';
import Masonry from "react-responsive-masonry"
import { GeneralProperty } from "./properties";
import {withTranslation} from "react-i18next";
const { v4:uuidv4 } = require('uuid');

const useStyles = makeStyles((theme) => ({
    drawer: {
        flexShrink: 0,
        whiteSpace: 'nowrap',
        width: theme.spacing(7) + 1,
        padding: 3,
        overflowX: 'hidden'
    },
    drawerPaper: {
        // width: theme.spacing(7) + 1,
        padding: 3,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        border: '0'
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        // width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    drawerContainer: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        overflow: 'auto',
        marginLeft: '20px'
        // padding: '2px'
    },
    popperPage: {
        left: '80px !important',
        top: '-100px !important'
    },
    popperPaper: {
        // border: '1px solid',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        width: '300px',
        maxHeight: '400px',
        overflowY: 'auto'
    }
}));

function CanvasLeftbar(props) {
    const classes = useStyles();
    const { addObject } = useCoreHandler();
    const { addFabricObject, t } = props;
    const [ stickerEl, setStickerEl ] = React.useState(null);
    const [ backgroundEl, setBackgroundEl ] = React.useState(null);
    const openSticker = Boolean(stickerEl);
    const idSticker = openSticker ? 'sticker-popper' : undefined;
    const openBackground = Boolean(backgroundEl);
    const idBackground = openBackground ? 'background-popper' : undefined;

    const onAddText = () => {
        const options = {
            id: uuidv4(),
            type: 'textbox',
            text: t("fabric.defaultText"),
            fontSize: 20,
            width: 150,
            fontWeight: 500,
            textAlign: 'center',
            fill: '#000000'
        };
        addObject(options, true).then(element => {
            addFabricObject({
                ...options,
                width: element.width,
                height: element.height,
                left: element.left,
                top: element.top,
                flipX: element.flipX || false,
                flipY: element.flipY || false,
            });
        });
    };

    const onAddImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const options = {
                    id: uuidv4(),
                    type: 'image',
                    url: reader.result
                };
                addObject(options, true).then(element => {
                    addFabricObject({
                        ...options,
                        width: element.width,
                        height: element.height,
                        left: element.left,
                        top: element.top,
                        flipX: element.flipX || false,
                        flipY: element.flipY || false,
                        filters: [{
                            type: 'grayscale',
                            key: false
                        }, {
                            type: 'invert',
                            key: false,
                        }, {
                            type: 'sepia',
                            key: false
                        }, {
                            type: 'brownie',
                            key: false
                        }, {
                            type: 'vintage',
                            key: false
                        }, {
                            type: 'blackwhite',
                            key: false
                        }, {
                            type: 'technicolor',
                            key: false
                        }, {
                            type: 'polaroid',
                            key: false
                        }, {
                            type: 'sharpen',
                            key: false
                        }, {
                            type: 'emboss',
                            key: false
                        }, {
                            type: 'brightness',
                            key: {brightness: 0}
                        }, {
                            type: 'contrast',
                            key: {contrast: 0}
                        }, {
                            type: 'saturation',
                            key: {saturation: 0}
                        }, {
                            type: 'noise',
                            key: {noise: 0}
                        }, {
                            type: 'pixelate',
                            key: {blocksize: 0}
                        }, {
                            type: 'blur',
                            key: {blur: 0}
                        }]
                    });
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const onShowStickerPanel = (event) => {
        setStickerEl(stickerEl ? null : event.currentTarget);
    };

    const onShowBackgroundPanel = (event) => {
        setBackgroundEl(backgroundEl ? null : event.currentTarget);
    };

    const handleStickyAction = (item) => {
        const options = {
            id: uuidv4(),
            type: 'svg',
            url: item
        };
        addObject(options, true).then(element => {
            addFabricObject({
                ...options,
                width: element.width,
                height: element.height,
                left: element.left,
                top: element.top,
                flipX: element.flipX || false,
                flipY: element.flipY || false,
            });
        });
    };

    const handleStickyClose = () => {
        setStickerEl(null);
    };

    const handleBackgroundClose = () => {
        setBackgroundEl(null);
    };

    return (
        <Drawer variant={'permanent'}
                className={classes.drawer}
                classes={{paper: classes.drawerPaper}}
                open
        >
            <div className={classes.drawerContainer}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Tooltip title={'Add Textbox'}>
                        <IconButton onClick={onAddText}>
                            <TextFieldsIcon/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={'Add Image'}>
                        <IconButton variant="contained" component="label">
                            <WallpaperOutlinedIcon/>
                            <input
                                onChange={onAddImage}
                                accept={'image/*'}
                                type={'file'}
                                hidden
                            />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={'Add Sticker'}>
                        <IconButton onClick={onShowStickerPanel}>
                            <ColorLensOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                    <Popover id={idSticker}
                             open={openSticker}
                             onClose={handleStickyClose}
                             anchorEl={stickerEl}
                             // className={classes.popperPage}
                             anchorOrigin={{
                                 vertical: 'bottom',
                                 horizontal: 'right',
                             }}
                             transformOrigin={{
                                 vertical: 'center',
                                 horizontal: 'left',
                             }}
                    >
                        <div className={classes.popperPaper}>
                            <Masonry>
                                {stickerItems.map((item, key) => (
                                    <ButtonBase
                                        key={key}
                                        focusRipple
                                        style={{height: '100%'}}
                                        onClick={() => handleStickyAction(item)}
                                    >
                                        <img
                                            src={item}
                                            style={{width: "100%", display: "block"}}
                                            alt={'Sticker'}
                                        />
                                    </ButtonBase>
                                ))}
                            </Masonry>
                        </div>
                    </Popover>

                    <Tooltip title={'Background Image'}>
                        <IconButton onClick={onShowBackgroundPanel}>
                            <DashboardIcon/>
                        </IconButton>
                    </Tooltip>
                    <Popover id={idBackground}
                             open={openBackground}
                             onClose={handleBackgroundClose}
                             anchorEl={backgroundEl}
                             anchorOrigin={{
                                 vertical: 'bottom',
                                 horizontal: 'right'
                             }}
                             transformOrigin={{
                                 vertical: 'center',
                                 horizontal: 'left'
                             }}
                    >
                        <div className={classes.popperPaper}>
                            <GeneralProperty/>
                        </div>
                    </Popover>
                </div>
            </div>
        </Drawer>
    )
}

const mapStateToProps = state => ({
    fabricObjects: state.common.fabricObjects
});

const mapDispatchToProps = dispatch => ({
    addFabricObject: (object) => dispatch(addFabricObject(object)),
    updateFabricCanvas: (object) => dispatch(updateFabricCanvas(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CanvasLeftbar));
