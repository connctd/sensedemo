import React from 'react';
import Room from './Room.js'
import { getMaxCoord, convertVectorArrayToPointsString, getOrigin } from '../../utils/Positioning.js'
import '../../App.css';

export default class Storey extends React.Component {
    render() {
        let data = this.props.data;
        let offset = this.props.offset;
        let subElementOffset = getOrigin(data.area, offset)

        let textPosition = getMaxCoord(data.area, offset);
        textPosition.x = textPosition.x + 15;
        textPosition.y = textPosition.y + data.level*25;

        let rooms = data.rooms;
        let rendered = rooms.map((room) =>
            <Room key={room.id}
                data={room} offset={subElementOffset}
            />
        )

        let points = convertVectorArrayToPointsString(data.area, offset);

        return (
            <svg>
                <polygon points={points} className="Storey" />
                {rendered}
            </svg>
        )
    }
}