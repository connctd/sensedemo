import React from 'react';
import Site from './Site.js'
import User from './User.js'
import Pointer from './Pointer.js'
import { getRightBottomCorner } from '../../utils/Positioning.js'
import '../../App.css';
import { findPositionTracker } from '../../utils/WoTConverter.js';
import { asInternalURL } from '../../utils/Common.js';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.setDimensions = this.setDimensions.bind(this);
        this.onCanvasClick = this.onCanvasClick.bind(this);

        this.state = { showUser: false, userPosition: {x: 0, y: 0}, scale: this.props.scale, allowPlaceUser: false };
    }

    setDimensions(scale) {
        var newState = this.state;
        newState.scale = scale;
        this.setState(newState);
    }

    setAllowPlaceUser(newMode) {
        var newState = this.state;
        newState.allowPlaceUser = newMode;
        this.setState(newState);
    }

    onCanvasClick(event) {
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
        var scaleX = maxSiteX/shownX;
        var scaleY = maxSiteY/shownY;

        // site is centered: remove offset left and top
        var rect = event.currentTarget.getBoundingClientRect()
        
        var x = (event.clientX - rect.left) * scaleX;
        var y = (event.clientY - rect.top) * scaleY;
        
        var newState = this.state;

        newState.userPosition = { x: x / 100 * this.state.scale, y: y / 100 * this.state.scale};

        this.setState(newState);

        this.onFakeUserPositionSet(newState.userPosition);
    }


    async onFakeUserPositionSet(pos) {
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

    render() {
        let data = this.props.model;
        
        if (data === null) {
            return "No model data...";
        }

        var highestCoords = { x: 0, y: 0 };

        // search for the site with max coords to figure out the canvas size
        for (var i = 0; i < data.length; i++) {
            var coords = getRightBottomCorner(data[i].area, this.props.offset);
            if (coords.x > highestCoords.x) {
                highestCoords.x = coords.x 
            }

            if (coords.y > highestCoords.y) {
                highestCoords.y = coords.y
            }
        }

        let viewBox = [0, 0, highestCoords.x + 10, highestCoords.y + 10];

        let renderedSites = data.map((site) =>
            <Site key={site.id} data={site} offset={this.props.offset} />
        )

        return (
            <svg onClick={this.onCanvasClick} width={this.state.scale + "%"} height={this.state.scale + "%"} viewBox={viewBox}>
                {renderedSites}
                <Pointer className={this.state.showUser ? 'User' : 'User Hidden'} position={this.state.userPosition} />
                <User
                    data={this.props.model}
                    key="userpos"
                    x={0}
                    y={0}
                    width={20}
                    height={20}/>
            </svg>
        )
    }
}