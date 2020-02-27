import React from 'react';
import '../App.css';

export default class Wall extends React.Component {
    getCoords() {
        let coords = {
            x1: this.props.x,
            y1: this.props.y
        }

        if (this.props.horizontal) {
            coords.x2 = this.props.x + this.props.length;
            coords.y2 = this.props.y;
        } else {
            coords.x2 = this.props.x;
            coords.y2 = this.props.y + this.props.length;
        }

        return coords;
    }

    render() {
        let coords = this.getCoords();
        return (
            <line {...coords} className="Wall" />
        )
    }
}