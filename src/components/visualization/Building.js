import React from 'react';
import Storey from './Storey.js'
import { getLeftBottomCorner, getRightBottomCorner, convertVectorArrayToPointsString, getOrigin } from '../../utils/Positioning.js'
import '../../App.css';

export default class Building extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        
        let data = this.props.data;
        
        let newStoreyVisibility = [];
        for (var i = 0; i < data.storeys.length; i++ ) {
            // default visible storey
            if (data.storeys[i].level === "1") {
                newStoreyVisibility[data.storeys[i].level] = "visible"
            } else {
                newStoreyVisibility[data.storeys[i].level] = "hidden"
            }
        }
        this.state = {storeyVisibility: newStoreyVisibility};
    }

    handleClick(level) {
        let data = this.props.data;

        let newStoreyVisibility = [];
        for (var i = 0; i < data.storeys.length; i++) {
            if (data.storeys[i].level === level) {
                newStoreyVisibility[data.storeys[i].level] = "visible"
            } else  {
                newStoreyVisibility[data.storeys[i].level] = "hidden"
            }
        }

        this.setState({ storeyVisibility: newStoreyVisibility });
    }

    render() {
        let data = this.props.data;
        let offset = this.props.offset;
        let subElementOffset = getOrigin(data.area, offset)

        let namePosition = getLeftBottomCorner(data.area, offset);
        namePosition.y = namePosition.y + 10;
        let storeyPosition = getRightBottomCorner(data.area, offset);

        let renderedStoreys = data.storeys.map((storey) => {
                return (
                    <svg key={storey.id}>
                        <svg>
                            <text onClick={() => this.handleClick(storey.level)} x={storeyPosition.x + 25} y={storeyPosition.y + storey.level * 16} className="StoreyName">{storey.name}</text>
                        </svg>
                        <svg visibility={this.state.storeyVisibility[storey.level]}>
                            <text x={storeyPosition.x + 15} y={storeyPosition.y + storey.level * 15} className="StoreyName">&bull;</text>
                        </svg>
                        <svg visibility={this.state.storeyVisibility[storey.level]}>
                            <Storey
                                data={storey} offset={subElementOffset}
                            />
                        </svg>
                    </svg> 
                );
            }
        )

        let points = convertVectorArrayToPointsString(data.area, offset);

        return (
            <svg>
                <defs>
                    <pattern id="backgroundBuilding" patternUnits="userSpaceOnUse" width="10" height="10">
                        <image href="/images/wall.png" x="0" y="0" width="10" height="10" />
                    </pattern>
                </defs>
                <polygon fill="url(#backgroundBuilding)" points={points} className="Building" />
                {renderedStoreys}
                <text {...namePosition} className="BuildingName">{data.name}</text>
            </svg>
        )
    }
}