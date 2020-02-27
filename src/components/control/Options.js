import React from 'react';
import '../../App.css';

export default class Options extends React.Component {
    constructor(props) {
        super(props);

        this.state = { inputValue: this.props.defaultValue, currZoom: this.props.defaultZoom };

        this.zoomIncrease = this.zoomIncrease.bind(this);
        this.zoomDecrease = this.zoomDecrease.bind(this);
    }

    zoomIncrease(event) {
        var newState = this.state;
        newState.currZoom = newState.currZoom+10;

        this.setState(newState);

        this.props.canvasRef.current.setDimensions(newState.currZoom + "%", newState.currZoom + "%");
    }

    zoomDecrease(event) {
        var newState = this.state;
        newState.currZoom = newState.currZoom - 10;

        this.setState(newState);

        this.props.canvasRef.current.setDimensions(newState.currZoom + "%", newState.currZoom + "%");
    }

    exit(event) {
        window.open("/", "_self")
    }

    render() {
        return (
            <div className="OptionsContainer">
                Options
                <br /><br />
                <button className="OptionsButton" onClick={this.zoomIncrease}>Zoom<br />+</button>
                <br /><br />
                {this.state.currZoom} %
                <br /><br />
                <button className="OptionsButton" onClick={this.zoomDecrease}>Zoom<br/>-</button>
                <br /><br />
                <button className="OptionsButton" onClick={this.exit}>Exit<br />&times;</button>
                
            </div>
        )
    }
}