import React from 'react';
import { getRightBottomCorner, convertVectorArrayToPointsString, getOrigin } from '../../utils/Positioning.js'
import Thing from './Thing.js'
import '../../App.css';

export default class Room extends React.Component {

    render() {
        let data = this.props.data;
        let offset = this.props.offset;
        let subElementOffset = getOrigin(data.area, offset)
        let textPosition = getRightBottomCorner(data.area, offset);

        let renderedThings = data.things.map((thing) =>
            <Thing key={thing.id}
                data={thing} offset={subElementOffset}
            />
        )

        let points = convertVectorArrayToPointsString(data.area, offset);
        return (
            <svg>
                <defs>
                    <pattern id="background" patternUnits="userSpaceOnUse" width="148" height="120">
                        <image href="/images/floor.jpg" x="0" y="0" width="148" height="120" />
                    </pattern>
                </defs>
                <polygon fill="url(#background)" points={points} className="Room" />
                <text {...textPosition} className="RoomName">{data.name}</text>
                {renderedThings}
            </svg>
        )
    }
}