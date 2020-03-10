import React from 'react';
import Site from './Site.js'
import User from './User.js'
import { getRightBottomCorner } from '../../utils/Positioning.js'
import '../../App.css';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.setDimensions = this.setDimensions.bind(this);
        this.onCanvasClick = this.onCanvasClick.bind(this);

        this.state = { showUser: false, userPosition: {x: 0, y: 0}, width: this.props.width, height: this.props.height };
    }

    setDimensions(width, height) {
        var newState = this.state;

        newState.width = width;
        newState.height = height;

        this.setState(newState);
    }

    onCanvasClick(event) {
        console.log(event.clientX);
        var newState = this.state;
        newState.userPosition = { x: event.clientX, y: event.clientY};
        this.setState(newState);
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
            <svg onClick={this.onCanvasClick} width={this.state.width} height={this.state.height} viewBox={viewBox}>
                {renderedSites}
                <User className={this.state.showUser ? 'User' : 'User Hidden'} position={this.state.userPosition} />
            </svg>
        )
    }
}