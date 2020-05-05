import React from 'react';
import Site from './Site.js'
import User from './User.js'
import { getRightBottomCorner } from '../../utils/Positioning.js'
import '../../App.css';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.setDimensions = this.setDimensions.bind(this);

        this.state = { showUser: false, scale: this.props.scale };
    }

    setDimensions(scale) {
        var newState = this.state;
        newState.scale = scale;
        this.setState(newState);
    }

    render() {
        let data = this.props.model;
        
        if (data === null) {
            return (<div>
                        <br />No model data...<br /><br />
                    </div>);
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

        var viewBox = [0, 0, highestCoords.x + 10, highestCoords.y + 10];

        let renderedSites = data.map((site) =>
            <Site key={site.id} data={site} offset={this.props.offset} mouseInputHandlerRef={this.props.mouseInputHandlerRef} />
        )

        return (
            <svg onClick={event => { this.props.mouseInputHandlerRef.current.onCanvasLeftClick(event); }} width={this.state.scale + "%"} height={this.state.scale + "%"} viewBox={viewBox}>
                {renderedSites}
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