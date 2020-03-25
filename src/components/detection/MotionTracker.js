import React from 'react';
import '../../App.css';
import { getOrigin } from '../../utils/Positioning.js'
import { BuildMotionDetectedEvent, CoordinateRelationRelative } from '../../utils/Events.js'

/*
    Polls all motion sensors and propagates latest motion coordinates on eventbus
*/
export default class MotionTracker extends React.Component {
    constructor(props) {
        super(props);

        this.state = { motionSensors: [], lastMotionPosition: { x: 0, y: 0 }, lastMotionDetected: 0, active: false };

        this.evaluateModel = this.evaluateModel.bind(this);
        this.checkMotionSensors = this.checkMotionSensors.bind(this);
        this.resolveThing = this.resolveThing.bind(this);
    }

    setActive(state) {
        var newState = this.state;
        newState.active = state;
        this.setState(newState);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.model !== this.props.model) {
            this.evaluateModel();
        }
    }

    // searches for thing that reflects user pos
    evaluateModel() {
        console.log("Searching for motion sensors");

        var newState = this.state;

        var motionSensors = [];

        for (var sID = 0; sID < this.props.model.length; sID++) {
            var currSite = this.props.model[sID];
            var buildingOffset = getOrigin(currSite.area, this.props.offset);

            for (var bID = 0; bID < currSite.buildings.length; bID++) {
                var currBuilding = currSite.buildings[bID];
                var storeyOffset = getOrigin(currBuilding.area, buildingOffset);

                for (var eID = 0; eID < currBuilding.storeys.length; eID++) {
                    var currStorey = currBuilding.storeys[eID];
                    var roomOffset = getOrigin(currStorey.area, storeyOffset);

                    for (var rID = 0; rID < currStorey.rooms.length; rID++) {
                        var currRoom = currStorey.rooms[rID];

                        for (var tID = 0; tID < currRoom.things.length; tID++) {
                            var currThing = currRoom.things[tID];
                            if (currThing.details.type === "motionsensor") {
                                motionSensors.push({ state: false, lastDetection: Date.now(), thing: currThing});
                            }
                        }
                    }
                }
            }
        }

        newState.motionSensors = motionSensors;

        this.setState(newState);
    }

    async checkMotionSensors() {
        if (!this.state.active) {
            // do nothing
            return
        }

        var motionSensors = this.state.motionSensors;

        // update all motion sensors
        for (var i = 0; i < motionSensors.length; i++) {
            var currMotionSensor = motionSensors[i];

            if (currMotionSensor.thing.details === undefined) {
                console.log("Motion sensor has no details");
                return;
            }

            // resolve position thing
            var state = await this.resolveThing(currMotionSensor.thing.details.stateURL);

            // sensor detected state change
            if (!currMotionSensor.state && state.movement) {
                currMotionSensor.lastDetection = Date.now();
            }

            // update sensor
            currMotionSensor.state = state.movement;
        }

        // identify newest change
        var lastMotionPosition = {x: 0, y: 0};
        var lastMotionDetected = 0;
        
        for (var j = 0; j < motionSensors.length; j++) {
            var currMotionSensor = motionSensors[j];

            // skip if its latest state is false
            if (!currMotionSensor.state) {
                continue;
            }

            if (currMotionSensor.lastDetection > lastMotionDetected) {
                lastMotionDetected = currMotionSensor.lastDetection;
                lastMotionPosition = currMotionSensor.thing.position;
            }
        }

        var newState = this.state;

        if (lastMotionDetected !== 0 && lastMotionDetected !== this.state.lastMotionDetected) {
            this.props.eventBusRef.current.publishEvent(BuildMotionDetectedEvent(lastMotionPosition, CoordinateRelationRelative));
            newState.lastPosition = lastMotionPosition;
            newState.lastMotionDetected = lastMotionDetected;
            
        }

        newState.motionSensors = motionSensors;
        this.setState(newState);
    }

    async resolveThing(url) {
        var resp = await fetch(url);

        if (resp.status === 200) {
            var jsonResp = await resp.json();

            return { movement: jsonResp.value, lastUpdate: jsonResp.lastUpdate };
        }

        return { movement: false };
    }

    componentDidMount() {
        this.interval = setInterval(this.checkMotionSensors, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}