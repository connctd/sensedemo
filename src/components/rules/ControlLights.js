import React from 'react';
import '../../App.css';
import { getOrigin } from '../../utils/Positioning.js'
import { EventTypeMotionDetected, CoordinateRelationAbsolute, CoordinateRelationRelative } from '../../utils/Events.js'
import ClassifyPoint from 'robust-point-in-polygon';

/*
    This rules switches lights in a room if motion was detected in a room
*/
export default class ControlLights extends React.Component {
    constructor(props) {
        super(props);

        this.state = { rooms: [], previousRoom: undefined };

        this.evaluateModel = this.evaluateModel.bind(this);
        this.onUserInRoom = this.onUserInRoom.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.model !== this.props.model) {
            this.evaluateModel();
            this.props.eventBusRef.current.subscribe(this);
        }
    }

    evaluateModel() {
        console.log("Rule is searching for lights in all rooms");

        var newState = this.state;

        var rooms = [];
        var positionThing;

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
                        var room = currStorey.rooms[rID];

                        // create a copy
                        var currRoom = { ...room };

                        for (var tID = 0; tID < currRoom.things.length; tID++) {
                            var currThing = currRoom.things[tID];
                            if (currThing.details.type === "position") {
                                positionThing = currThing;
                            }
                        }

                        // set absolute room coords so algo has less work
                        var polygonAbsolute = [];
                        var polygonRelative = [];
                        for (var cID = 0; cID < currRoom.area.length; cID++) {
                            var coords = currRoom.area[cID];
                            var pairAbs = [coords.x + roomOffset.x, coords.y + roomOffset.y];
                            var pairRel = [coords.x, coords.y];

                            polygonAbsolute.push(pairAbs);
                            polygonRelative.push(pairRel);
                        }

                        currRoom.polygonAbsolute = polygonAbsolute;
                        currRoom.polygonRelative = polygonRelative;

                        rooms.push(currRoom);
                    }
                }
            }
        }

        newState.rooms = rooms;
        newState.positionThing = positionThing;

        this.setState(newState);
    }

    async onEvent(event) {
        if (event.type !== EventTypeMotionDetected) {
            return
        }

        for (var rID = 0; rID < this.state.rooms.length; rID++) {
            var room = this.state.rooms[rID];

            if (event.relation === CoordinateRelationAbsolute) {
                var result = ClassifyPoint(room.polygonAbsolute, [event.coords.x, event.coords.y]);
                if (result === -1) {
                    this.onUserInRoom(room);
                    return;
                }
            } else {
                var result = ClassifyPoint(room.polygonRelative, [event.coords.x, event.coords.y]);
                if (result === -1) {
                    this.onUserInRoom(room);
                    return;
                }
            }
        }
    }

    async onUserInRoom(room) {
        if (room !== this.state.previousRoom) {
            if (this.state.previousRoom !== undefined) {
                console.log("User has changed room from " + this.state.previousRoom.name + " to " + room.name);
                this.turnOffLightsInRoom(this.state.previousRoom);
                this.turnOnLightsInRoom(room);
            } else {
                this.turnOnLightsInRoom(room);
            }

            var newState = this.state;
            newState.previousRoom = room;
            this.setState(newState);
        }
    }

    async turnOnLightsInRoom(room) {
        console.log("Turning on lights in "+room.name);
        console.log(room);
        for (var i = 0; i < room.things.length; i++ ) {
            var currThing = room.things[i].details;
            if (currThing.type !== "lamp") {
                continue;
            }

            if (currThing.switchURL === "") {
                console.log("Light has no switch url");
                continue;
            }

            this.setLightState(currThing.switchURL, true);
        }
    }

    async turnOffLightsInRoom(room) {
        console.log("Turning off lights in " + room.name);
        
        for (var i = 0; i < room.things.length; i++) {
            var currThing = room.things[i].details;
            if (currThing.type !== "lamp") {
                continue;
            }

            if (currThing.switchURL === "") {
                console.log("Light has no switch url");
                continue;
            }

            this.setLightState(currThing.switchURL, false);
        }
    }

    async setLightState(url, state) {
        var resp = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"on": state})
        });

        if (resp.status < 200 || resp.status > 204) {
            console.error("Failed to set light state of "+url);   
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.checkRule, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="AlgoView">
                <h1>Evaluation</h1>
                User is in place {this.state.previousRoom !== undefined ? this.state.previousRoom.name : "UNKNOWN" }
            </div>
        )
    }
}