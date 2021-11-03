import * as React from 'react';
import {withTranslation} from 'react-i18next';
import {useEffect} from 'react';
import {connect} from 'react-redux';
import {fabric} from 'fabric';
import {useCanvasContext} from './hooks';
import {useCoreHandler} from './handlers';
import {removeFabricObject, updateFabricObject, addFabricObject} from '../../redux/common/actions';
import {ContextMenu, RightContextMenu} from './ContextMenu';
import {
    useCustomizationHandler,
    useEventsHandler,
    useZoomHandler,
    useContainerHandler,
    useGuidelinesHandler,
    usePanningHandler,
    useImageHandler
} from './handlers';

function Canvas(props) {
    const containerRef = useContainerHandler();
    const { setCanvas, canvas, activeObject } = useCanvasContext();
    const { addObject, setCanvasBackgroundImage, resizeCanvas } = useCoreHandler();
    const { fabricCanvas, addFabricObject, isMobile } = props;
    const { applyFilters } = useImageHandler();
    useCustomizationHandler();
    useGuidelinesHandler(props.fabricObjects, props.updateFabricObject);
    useEventsHandler(props.removeFabricObject);
    useZoomHandler();
    usePanningHandler();

    useEffect(() => {
        const canvas = new fabric.Canvas('canvas', {
            backgroundColor: fabricCanvas.backgroundColor,
            // height: fabricCanvas.height,
            // width: fabricCanvas.width,
            fireRightClick: true,
            preserveObjectStacking: true,
            stopContextMenu: true
        });

        fabric.util.addListener(document.getElementsByClassName('upper-canvas')[0], 'contextmenu', function (e) {
            e.preventDefault();
            return false;
        })

        setCanvas(canvas);

        // const workarea = new fabric.Rect({
        //     //@ts-ignore
        //     id: 'workarea',
        //     width: initialWidth,
        //     height: initialHeight,
        //     absolutePositioned: true,
        //     fill: '#f0f0f0',
        //     selectable: false,
        //     hoverCursor: 'default'
        // });
        //
        // canvas.add(workarea);
        //
        // workarea.center();
    }, []);

    useEffect(() => {
        if (canvas) {
            const { fabricObjects, fabricCanvas, promise } = props;
            const extractTextPattern = /(<([^>]+)>)/gi;
            let extractedText = promise.description.replace(extractTextPattern, '');

            resizeCanvas(fabricCanvas.width, fabricCanvas.height);
            if (fabricObjects && fabricObjects.length > 0) {
                fabricObjects.forEach((object) => {
                    const { filters, ...options } = object;
                    if (object.type === 'image') {
                        addObject({
                            ...options,
                            url: `${process.env.REACT_APP_AWS_PUBLIC_URL}${options.url}`
                        }).then(element => {
                            if (element && filters.length > 0) {
                                applyFilters(element, filters);
                            }
                        });
                    } else {
                        addObject(options);
                    }
                });
            } else {
                const options = {
                    id: 'preserved',
                    type: 'textbox',
                    text: extractedText,
                    fontSize: 30,
                    width: 200,
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
                        top: element.top
                    });
                })
            }
            if (fabricCanvas && fabricCanvas.backgroundImage) {
                setCanvasBackgroundImage(`${process.env.REACT_APP_AWS_PUBLIC_URL}${fabricCanvas.backgroundImage}`);
            }
        }
    }, [canvas]);

    return (
        <React.Fragment>
            {activeObject && <ContextMenu/>}
            <div onContextMenu={() => {
                return false;
            }}>
                {activeObject && <RightContextMenu/>}
            </div>
            <div ref={containerRef}>
                {
                    isMobile ?
                        <canvas id='canvas' width={200} height={300}/>
                        :
                        <canvas id='canvas' width={400} height={600}/>
                }
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    fabricObjects: state.common.fabricObjects,
    fabricCanvas: state.common.fabricCanvas,
    promise: state.common.singlePromise
});

const mapDispatchToProps = dispatch => ({
    removeFabricObject: (object) => dispatch(removeFabricObject(object)),
    updateFabricObject: (object) => dispatch(updateFabricObject(object)),
    addFabricObject: (object) => dispatch(addFabricObject(object))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Canvas));
