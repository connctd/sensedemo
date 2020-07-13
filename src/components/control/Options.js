import React from 'react';
import '../../App.css';
import ModelEditor from './ModelEditor.js';
import FeedViewer from './FeedViewer';

export default class Options extends React.Component {
    constructor(props) {
        super(props);

        this.state = { currZoom: this.props.defaultZoom, editorVisible: false, detectionMode: "none", feedOneVisible: false, feedTwoVisible: false };

        this.zoomIncrease = this.zoomIncrease.bind(this);
        this.zoomDecrease = this.zoomDecrease.bind(this);
        this.switchDetectionMode = this.switchDetectionMode.bind(this);
        this.toggleModelEditor = this.toggleModelEditor.bind(this);
        this.toggleFeedOne = this.toggleFeedOne.bind(this);
        this.toggleFeedTwo = this.toggleFeedTwo.bind(this);
    }

    zoomIncrease(event) {
        var newState = this.state;
        newState.currZoom = newState.currZoom+10;

        this.setState(newState);

        this.props.canvasRef.current.setDimensions(newState.currZoom);
        this.props.mouseInputHandlerRef.current.setScale(newState.currZoom);
    }

    zoomDecrease(event) {
        var newState = this.state;
        newState.currZoom = newState.currZoom - 10;

        this.setState(newState);

        this.props.canvasRef.current.setDimensions(newState.currZoom);
        this.props.mouseInputHandlerRef.current.setScale(newState.currZoom);
    }

    switchDetectionMode(event) {
        var newState = this.state;
        newState.detectionMode = event.target.value;
        this.setState(newState);
        
        if (event.target.value === "none") {
            this.props.mouseInputHandlerRef.current.setAllowPlaceUser(false);
            this.props.detectionUserTrackerRef.current.setActive(false);
            this.props.detectionMotionTrackerRef.current.setActive(false);
        } else if (event.target.value === "userpos") {
            this.props.mouseInputHandlerRef.current.setAllowPlaceUser(true);
            this.props.detectionUserTrackerRef.current.setActive(true);
            this.props.detectionMotionTrackerRef.current.setActive(false);
        } else if (event.target.value === "sensors") {
            this.props.mouseInputHandlerRef.current.setAllowPlaceUser(false);
            this.props.detectionUserTrackerRef.current.setActive(false);
            this.props.detectionMotionTrackerRef.current.setActive(true);
        }
    }

    toggleModelEditor() {
        var newState = this.state;
        newState.feedOneVisible = false;
        newState.feedTwoVisible = false;
        newState.editorVisible = !this.state.editorVisible;
        this.setState(newState);
    }

    toggleFeedOne() {
        var newState = this.state;
        newState.editorVisible = false;
        newState.feedTwoVisible = false;
        newState.feedOneVisible = !this.state.feedOneVisible;
        this.setState(newState);
    }

    toggleFeedTwo() {
        var newState = this.state;
        newState.editorVisible = false;
        newState.feedOneVisible = false;
        newState.feedTwoVisible = !this.state.feedTwoVisible;
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
                <button className="OptionsButton" onClick={this.toggleFeedOne}>Feed 1<br />Berlin</button>
                <br /><br />
                <button className="OptionsButton" onClick={this.toggleFeedTwo}>Feed 2<br />Drtmnd</button>
                <br /><br />
                <button className="OptionsButton" onClick={this.exit}>Exit<br />&times;</button>
                <br /><br />
                Detection
                <br /><br />
                <select value={this.state.detectionMode} onChange={this.switchDetectionMode}>
                    <option value="none">None</option>
                    <option value="userpos">UserPos</option>
                    <option value="sensors">Sensors</option>
                </select>

                <div className={this.state.editorVisible ? 'EditModelView' : 'EditModelView Hidden'}>
                    <ModelEditor model={this.props.model} modelChangeHandler={this.props.modelChangeHandler} cancelHandler={this.toggleModelEditor}/>
                </div>

                <div className={this.state.feedOneVisible ? 'FeedViewOne' : 'FeedViewOne Hidden'}>
                    <FeedViewer mode="img" frameWidth="1024" frameHeight="768" frameSrc="http://34.77.75.224/stream" cancelHandler={this.toggleFeedOne} />
                </div>

                <div className={this.state.feedTwoVisible ? 'FeedViewTwo' : 'FeedViewTwo Hidden'}>
                    <FeedViewer frameWidth="1024" frameHeight="768" frameSrc="https://h2736811.stratoserver.net:61033/" cancelHandler={this.toggleFeedTwo} />
                </div>
                
            </div>
        )
    }
}
