import React from 'react';
import ClassifyPoint from 'robust-point-in-polygon';
import '../../App.css';
import { getOrigin } from '../../utils/Positioning.js'
import { BuildUserInPlaceEvent } from '../../utils/Events.js'

/*
    This rules switches light if a user is an specific room
*/
export default class EventBus extends React.Component {
    constructor(props) {
        super(props);

        this.state = { listeners: [] };

        this.publishEvent = this.publishEvent.bind(this);
    }

    publishEvent(event) {
        for (var i = 0; i < this.state.listeners.length; i++) {
            this.state.listeners[i].onEvent(event);
        }
    }

    subscribe(listener) {
        var newState = this.state;
        var listeners = this.state.listeners;
        listeners.push(listener);
        newState.listeners = listeners;
        this.setState(newState);
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}