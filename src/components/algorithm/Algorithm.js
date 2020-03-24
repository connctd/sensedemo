import React from 'react';
import ClassifyPoint from 'robust-point-in-polygon';
import '../../App.css';
import { getOrigin } from '../../utils/Positioning.js'

export default class Algorithm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { positionThing: undefined, rooms: [], previousRoom: undefined };

        this.evaluateModel = this.evaluateModel.bind(this);
        this.checkRule = this.checkRule.bind(this);
        this.resolveThing = this.resolveThing.bind(this);
        this.onUserInRoom = this.onUserInRoom.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.model !== this.props.model) {
            console.log("Input model has changed");
            this.evaluateModel();
        }
    }

    // searches for thing that reflects user pos
    evaluateModel() {
        console.log("Reevaluating model");

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
                        var polygon = [];
                        for (var cID = 0; cID < currRoom.area.length; cID++) {
                            var coords = currRoom.area[cID];
                            var pair = [coords.x + roomOffset.x, coords.y + roomOffset.y];
                            
                            polygon.push(pair);
                        }

                        currRoom.polygon = polygon;

                        rooms.push(currRoom);
                    }
                }
            }
        }

        newState.rooms = rooms;
        newState.positionThing = positionThing;

        this.setState(newState);
    }

    async checkRule() {
        if (this.state.positionThing === undefined || this.state.positionThing.details === undefined) {
            console.log("No position thing found");
            return;
        }

        // resolve position thing
        var coords = await this.resolveThing(this.state.positionThing.details.xURL, this.state.positionThing.details.yURL);
        if (coords.x === 0 && coords.y === 0) {
            console.log("Ignoring position since both values are 0");
            return;
        }

        for (var rID = 0; rID < this.state.rooms.length; rID++) {
            var room = this.state.rooms[rID];

            var result = ClassifyPoint(room.polygon, [coords.x, coords.y]);
            if (result === -1) {
                this.onUserInRoom(room);
                return;
            }
        }
    }

    async resolveThing(xURL, yURL) {
        var respX = await fetch(xURL);
        var respY = await fetch(yURL);

        if (respX.status === 200 && respY.status === 200) {
            var jsonRespX = await respX.json();
            var jsonRespY = await respY.json();

            return {x: jsonRespX.value, y: jsonRespY.value};
        }

        return { x: 0, y: 0 };
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

        var newState = this.state;

        if (resp.status !== 200) {
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