import React from 'react';
import './../App.css';
import Canvas from './visualization/Canvas.js';
import Options from './control/Options.js';
import ModelLog from './control/ModelLog.js';
import MouseInputHandler from './control/MouseInputHandler.js';
import NotificationLog from './control/NotificationLog.js';
import ControlLights from './rules/ControlLights.js';
import EventBus from './detection/EventBus.js';
import UserTracker from './detection/UserTracker.js';
import MotionTracker from './detection/MotionTracker';
import ExpandableObject from './control/ExpandableObject.js';
import { parseModel } from '../utils/LocationParser.js';
import { asInternalURL } from '../utils/Common.js'

export default class ModelView extends React.Component {
    constructor(props) {
        super(props);

        var inputModel = {};

        this.canvasAreaRef = React.createRef();
        this.eventBusRef = React.createRef();
        this.detectionUserTrackerRef = React.createRef();
        this.detectionMotionTrackerRef = React.createRef();
        this.mouseInputHandlerRef = React.createRef();
        
        this.state = { inputModel: inputModel, outputModel: null, logEntries: [], notificationEntries: [] };

        this.onParseError = this.onParseError.bind(this);
        this.onParseWarning = this.onParseWarning.bind(this);
        this.onParseInfo = this.onParseInfo.bind(this);
        this.onParseSuccess = this.onParseSuccess.bind(this);
        this.onParseNotification = this.onParseNotification.bind(this);
        this.onFetchedModelChanged = this.onFetchedModelChanged.bind(this);

        // get link to model and parse it
        var decodedString = decodeURIComponent(this.props.match.params.model)
        decodedString = Buffer.from(decodedString, 'base64').toString('ascii');
        console.log(decodedString);

        var modelURL = asInternalURL(decodedString, "backend");
        this.loadRemoteModel(modelURL);
    }

    onParseError(message, obj) {
        console.error(message, obj);
        this.addLogEntry("err", message, obj);
    }

    onParseWarning(message, obj) {
        console.warn(message, obj);
        this.addLogEntry("warn", message, obj);
    }

    onParseInfo(message, obj) {
        console.info(message, obj);
        this.addLogEntry("info", message, obj);
    }

    onParseNotification(message, obj) {
        console.info(message, obj);
        this.addNotificationEntry("info", message, obj);
    }

    onParseSuccess(message, obj) {
        this.addLogEntry("info", message, obj);

        var newState = this.state;
        newState.outputModel = obj;

        this.setState(newState);
    }

    // triggered when edited
    onFetchedModelChanged(newModel) {
        var parsedModel;
        var e;

        try {
            parsedModel = JSON.parse(newModel);    
        } catch (err) {
            console.error(err);
            e = err;
        }

        var newState = this.state;
        newState.inputModel = parsedModel;
        newState.logEntries = [];
        this.setState(newState);
        
        if (parsedModel !== undefined) {
            parseModel(parsedModel, this.onParseSuccess, this.onParseError, this.onParseWarning, this.onParseInfo, this.onParseNotification);
        } else {
            this.onParseError("Model seems to be invalid", { "msg": e + ""});
        }
    }

    addLogEntry(severity, message, obj) {
        var newDate = new Date();
        var dateString = newDate.toUTCString();
        
        var newState = this.state;
        newState.logEntries.push(<ExpandableObject
            key={newState.logEntries.length + "-" + dateString}
            severity={severity}
            message={message}
            json={obj != null ? JSON.stringify(obj, null, 4) : null} 
        />);
        this.setState(newState);
    }

    addNotificationEntry(severity, message, obj) {
        var newState = this.state;
        newState.notificationEntries.push(<ExpandableObject
            key={"notification-" + newState.notificationEntries.length}
            severity={severity}
            message={message}
            json={obj != null ? JSON.stringify(obj, null, 4) : null}
        />);
        this.setState(newState);
    }

    async loadRemoteModel(modelURI) {
        var resp = await fetch(modelURI);

        if (resp.status === 200) {
            var body = await resp.json();
            parseModel(body, this.onParseSuccess, this.onParseError, this.onParseWarning, this.onParseInfo, this.onParseNotification);
        } else {
            this.onParseError("Failed to load model", modelURI);
        }

        
    }

    componentDidMount() {
        
    }

    render() {
        // offset allow us relative positioning instead of absolute positioning
        let offset = { x: 2, y: 2 };

        if (this.props.match.params.model == null) {
            return (
                <p>Error. No Model input</p>
            );
        } else {
            return (
                <div className="App">
                    <MouseInputHandler ref={this.mouseInputHandlerRef} scale="80" model={this.state.outputModel} />
                    <Canvas ref={this.canvasAreaRef} scale="80" model={this.state.outputModel} mouseInputHandlerRef={this.mouseInputHandlerRef} offset={offset} />
                    <ModelLog entries={this.state.logEntries} />
                    <NotificationLog entries={this.state.notificationEntries} />
                    <EventBus ref={this.eventBusRef} />
                    <UserTracker ref={this.detectionUserTrackerRef} model={this.state.outputModel} offset={offset} eventBusRef={this.eventBusRef}/>
                    <MotionTracker ref={this.detectionMotionTrackerRef} model={this.state.outputModel} offset={offset} eventBusRef={this.eventBusRef} />
                    <ControlLights eventBusRef={this.eventBusRef} model={this.state.outputModel} offset={offset} />
                    <Options
                        defaultZoom={80}
                        detectionMotionTrackerRef={this.detectionMotionTrackerRef}
                        detectionUserTrackerRef={this.detectionUserTrackerRef}
                        mouseInputHandlerRef={this.mouseInputHandlerRef}
                        canvasRef={this.canvasAreaRef}
                        model={this.state.inputModel}
                        modelChangeHandler={this.onFetchedModelChanged}
                    />
                </div>
            );
        }
    }
}
