import React from 'react';
import '../../App.css';
import { findPositionTracker } from '../../utils/WoTConverter.js';
import { asInternalURL } from '../../utils/Common.js';
import AddThingDescriptionWindow from './AddThingDescriptionWindow.js';

export default class MouseInputHandler extends React.Component {
    constructor(props) {
        super(props);

        this.showAddThingDescriptionWindow = this.showAddThingDescriptionWindow.bind(this);
        this.hideAddThingDescriptionWindow = this.hideAddThingDescriptionWindow.bind(this);
        this.removeThingDescription = this.removeThingDescription.bind(this);

        var roomInformation = {name: "", id: "", x: "", y: ""};
        var thingInformation = { id: "" };

        this.state = { allowPlaceUser: false,
            scale: this.props.scale,
            showRoomContextMenu: false,
            showThingContextMenu: false,
            contextMenuPosX: 0,
            contextMenuPosY: 0,
            addThingDescriptionVisible: false,
            roomInformation: roomInformation,
            thingInformation: thingInformation
        };
    }

    setScale(newScale) {
        var newState = this.state;
        newState.scale = newScale;
        this.setState(newState);
    }

    setAllowPlaceUser(newMode) {
        var newState = this.state;
        newState.allowPlaceUser = newMode;
        this.setState(newState);
    }

    setShowRoomContextMenu(show, x, y) {
        var newState = this.state;
        newState.showRoomContextMenu = show;
        newState.contextMenuPosX = x;
        newState.contextMenuPosY = y;
        this.setState(newState);
    }

    setShowThingContextMenu(show, x, y) {
        var newState = this.state;
        newState.showThingContextMenu = show;
        newState.contextMenuPosX = x;
        newState.contextMenuPosY = y;
        this.setState(newState);
    }

    setAddThingDescriptionVisible(vis) {
        var newState = this.state;
        newState.addThingDescriptionVisible = vis;
        this.setState(newState);
    }

    setRoomInformation(name, id, x, y) {
        var roomInformation = { name: name, id: id, x: x, y: y };
        var newState = this.state;
        newState.roomInformation = roomInformation;
        this.setState(newState);
    }

    setThingInformation(id) {
        var thingInformation = { id: id };
        var newState = this.state;
        newState.thingInformation = thingInformation;
        this.setState(newState);
    }

    onCanvasLeftClick(event) {
        this.setShowRoomContextMenu(false, 0, 0);
        this.setShowThingContextMenu(false, 0, 0);

        if (!this.state.allowPlaceUser) {
            return;
        }

        var canvasViewbox = event.currentTarget.viewBox.baseVal;
        // max coords of sites
        var maxSiteX = canvasViewbox.width;
        var maxSiteY = canvasViewbox.height;

        // how this is shown on screen
        var shownX = event.currentTarget.width.baseVal.value;
        var shownY = event.currentTarget.height.baseVal.value;

        // ui is stretching the sites -> calculate scale
        var scaleX = maxSiteX / shownX;
        var scaleY = maxSiteY / shownY;

        // site is centered: remove offset left and top
        var rect = event.currentTarget.getBoundingClientRect()

        var x = (event.clientX - rect.left) * scaleX;
        var y = (event.clientY - rect.top) * scaleY;

        var newState = this.state;

        newState.userPosition = { x: x / 100 * this.state.scale, y: y / 100 * this.state.scale };

        console.log("Set user on");
        console.log(newState.userPosition);

        this.setState(newState.userPosition);

        this.setUserPos(newState.userPosition);
    }

    async setUserPos(pos) {
        var tracker = findPositionTracker(this.props.model);

        if (tracker === undefined) {
            console.error("Model has no position tracker. Unable to set position");
            return;
        }

        var xconfig = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "value": pos.x.toString() })
        }

        var yconfig = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "value": pos.y.toString() })
        }

        var xURL = "https://api.connctd.io/api/v1/things/a359ce93-098c-41ec-9ef1-8c2846d258f7/components/tracker/properties/x";
        var yURL = "https://api.connctd.io/api/v1/things/a359ce93-098c-41ec-9ef1-8c2846d258f7/components/tracker/properties/y";

        var respX = await fetch(asInternalURL(xURL, "backend"), xconfig);
        var respY = await fetch(asInternalURL(yURL, "backend"), yconfig);

        if (respX.status !== 204 && respY.status !== 204) {
            console.error("Bad response");
        }
    }

    onThingRightClick(event, elem) {
        this.setShowRoomContextMenu(false, 0, 0);
        this.setShowThingContextMenu(true, event.pageX + 1, event.pageY + 1);

        console.log(event);
        console.log(elem);

        this.setThingInformation(elem.id);

        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    onRoomRightClick(event, ref, elem) {
        this.setShowThingContextMenu(false, 0, 0);
        this.setShowRoomContextMenu(true, event.pageX+1, event.pageY+1);
        
        var svg = event.currentTarget;
        var pt = svg.createSVGPoint();

        pt.x = event.clientX;
        pt.y = event.clientY;

        // now we know the click position but in relation to the whole canvas
        var canvasPosition = pt.matrixTransform(svg.getScreenCTM().inverse());

        // get the root point
        var polygonOriginPoint = ref.current.points[0];

        var posX = Math.round((canvasPosition.x - polygonOriginPoint.x) * 100) / 100
        var posY = Math.round((canvasPosition.y - polygonOriginPoint.y) * 100) / 100

        this.setRoomInformation(elem.name, elem.id, posX, posY);

        event.preventDefault();
        event.stopPropagation();

        return false;
    }

    showAddThingDescriptionWindow() {
        this.setShowRoomContextMenu(false);
        this.setAddThingDescriptionVisible(true);
    }

    hideAddThingDescriptionWindow() {
        this.setAddThingDescriptionVisible(false);
    }

    removeThingDescription() {
        this.setShowThingContextMenu(false, 0, 0);
        console.log("Not implemented. We first need a better approach for referencing tds from within locations");
    } 

    render() {
        return (
            <div>
                <AddThingDescriptionWindow roomInformation={this.state.roomInformation} windowVisible={this.state.addThingDescriptionVisible} cancelHandler={this.hideAddThingDescriptionWindow} />

                <div className={this.state.showRoomContextMenu ? 'ContextMenu' : 'ContextMenu Hidden'} style={{ left: this.state.contextMenuPosX, top: this.state.contextMenuPosY }}>
                    <button className="ContextMenuButton" onClick={this.showAddThingDescriptionWindow}>Add Thing Description here</button>
                </div>

                <div className={this.state.showThingContextMenu ? 'ContextMenu' : 'ContextMenu Hidden'} style={{ left: this.state.contextMenuPosX, top: this.state.contextMenuPosY }}>
                    <button className="ContextMenuButton" onClick={this.removeThingDescription}>Remove Thing Description</button>
                </div>
            </div>
        )
    }

}