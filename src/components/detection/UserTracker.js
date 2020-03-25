import React from 'react';
import '../../App.css';
import { getOrigin } from '../../utils/Positioning.js'
import { BuildMotionDetectedEvent, CoordinateRelationAbsolute } from '../../utils/Events.js'

/*
    Polls a tracker and propagates latest coordinates on eventbus
*/
export default class UserTracker extends React.Component {
    constructor(props) {
        super(props);

        this.state = { positionThing: undefined, lastPosition: {x: 0, y: 0}, active: false };

        this.evaluateModel = this.evaluateModel.bind(this);
        this.checkPositionTracker = this.checkPositionTracker.bind(this);
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
        console.log("Searching for position thing");

        var newState = this.state;

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
                        var currRoom = currStorey.rooms[rID];

                        for (var tID = 0; tID < currRoom.things.length; tID++) {
                            var currThing = currRoom.things[tID];
                            if (currThing.details.type === "position") {
                                positionThing = currThing;
                            }
                        }
                    }
                }
            }
        }

        newState.positionThing = positionThing;

        this.setState(newState);
    }

    async checkPositionTracker() {
        if (!this.state.active) {
            // do nothing
            return
        }

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

        if (coords.x !== this.state.lastPosition.x || coords.y !== this.state.lastPosition.y) {
            var newState = this.state;
            this.props.eventBusRef.current.publishEvent(BuildMotionDetectedEvent(coords, CoordinateRelationAbsolute));

            newState.lastPosition = coords;
            this.setState(newState);
        }
    }

    async resolveThing(xURL, yURL) {
        var respX = await fetch(xURL);
        var respY = await fetch(yURL);

        if (respX.status === 200 && respY.status === 200) {
            var jsonRespX = await respX.json();
            var jsonRespY = await respY.json();

            return { x: jsonRespX.value, y: jsonRespY.value };
        }

        return { x: 0, y: 0 };
    }

    componentDidMount() {
        this.interval = setInterval(this.checkPositionTracker, 1000);
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