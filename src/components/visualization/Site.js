import React from 'react';
import Building from './Building.js';
import { getMaxCoord, convertVectorArrayToPointsString, getOrigin } from '../../utils/Positioning.js'
import '../../App.css';

export default class Site extends React.Component {
    render() {
        let data = this.props.data;
        let offset = this.props.offset;
        let subElementOffset = getOrigin(data.area, offset)

        let textPosition = getMaxCoord(data.area, offset);

        let buildings = data.buildings;
        let renderedBuildings = buildings.map((building) => 
            <Building key={building.id} 
                data={building} offset={subElementOffset}
            />
        )
        
        let points = convertVectorArrayToPointsString(data.area, offset);

        return (
            <svg>
                <defs>
                    <pattern id="backgroundSite" patternUnits="userSpaceOnUse" width="50" height="50">
                        <image href="/images/site.jpg" x="0" y="0" width="200" height="200"/>
                    </pattern>
                </defs>
                <polygon fill="url(#backgroundSite)" points={points} className="Site" />
                {renderedBuildings}
                <text {...textPosition} className="SiteName">{data.name}</text>
            </svg>
        )
    }
}