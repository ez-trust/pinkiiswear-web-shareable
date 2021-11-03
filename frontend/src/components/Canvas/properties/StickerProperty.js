import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
    ImageList,
    ImageListItem,
    makeStyles,
    withStyles,
    ButtonBase
} from '@material-ui/core';
import { stickerItems } from '../constants/constants';
import { useCoreHandler } from '../handlers';
import { addFabricObject } from '../../../redux/common/actions';
const { v4:uuidv4 } = require('uuid');

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    imageList: {
        padding: '3px'
        // width: 500,
        // height: 450,
    },
    image: {
        width: '100%',
        height: 'auto',
        maxHeight: '100px'
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

const CustomImageListItem = withStyles({
    root: {
        boxShadow: 'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px'
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }
})(ImageListItem);

function StickerProperty(props) {
    const classes = useStyles();
    const { addObject } = useCoreHandler();
    const { addFabricObject } = props;

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
                top: element.top
            });
        });
    };

    return (
        <ImageList rowHeight={100}  variant="masonry" className={classes.imageList} cols={2} gap={8}>
            {stickerItems.map((item, key) => (
                <CustomImageListItem key={key}>
                    <ButtonBase
                        focusRipple
                        style={{
                            height: '100%'
                        }}
                        onClick={() => handleStickyAction(item)}
                    >
                        <img src={item} className={classes.image} alt={'sticker'}/>
                    </ButtonBase>
                </CustomImageListItem>
            ))}
        </ImageList>
    )
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    addFabricObject: (object) => dispatch(addFabricObject(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(StickerProperty));
