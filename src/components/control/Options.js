import React from 'react';
import '../../App.css';
import ModelEditor from './ModelEditor.js';

export default class Options extends React.Component {
    constructor(props) {
        super(props);

        this.state = { currZoom: this.props.defaultZoom, editorVisible: false };

        this.zoomIncrease = this.zoomIncrease.bind(this);
        this.zoomDecrease = this.zoomDecrease.bind(this);
        this.toggleModelEditor = this.toggleModelEditor.bind(this);
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

    toggleModelEditor() {
        var newState = this.state;
        newState.editorVisible = !this.state.editorVisible;
        this.setState(newState);
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
                <button className="OptionsButton" onClick={this.toggleModelEditor}>Model<br />&lt;&gt;</button>
                <br /><br />
                <button className="OptionsButton" onClick={this.exit}>Exit<br />&times;</button>

                <div className={this.state.editorVisible ? 'EditModelView' : 'EditModelView Hidden'}>
                    <ModelEditor model={this.props.model} modelChangeHandler={this.props.modelChangeHandler} cancelHandler={this.toggleModelEditor}/>
                </div>
                
            </div>
        )
    }
}