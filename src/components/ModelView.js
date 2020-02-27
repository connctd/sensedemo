import React from 'react';
import './../App.css';
import Canvas from './visualization/Canvas.js';
import Options from './control/Options.js';

export default class ModelView extends React.Component {

    constructor(props) {
        super(props);

        let sites = [
            {
                "id": "1",
                "name": "My Site",
                "area": [
                    { "x": 0, "y": 10 },
                    { "x": 600, "y": 10 },
                    { "x": 600, "y": 300 },
                    { "x": 0, "y": 300 },
                ],
                "buildings": [
                    {
                        "id": "2",
                        "name": "Virtual Building",
                        "area": [
                            { "x": 10, "y": 10 },
                            { "x": 300, "y": 10 },
                            { "x": 300, "y": 100 },
                            { "x": 450, "y": 100 },
                            { "x": 450, "y": 200 },
                            { "x": 10, "y": 200 },
                        ],
                        "storeys": [
                            {
                                "id": "3a",
                                "name": "Ground Floor",
                                "level": 0,
                                "area": [
                                    { "x": 0, "y": 0 },
                                    { "x": 300, "y": 0 },
                                    { "x": 300, "y": 190 },
                                    { "x": 0, "y": 190 },
                                ],
                                "rooms": []
                            },
                            {
                                "id": "3b",
                                "name": "First Floor",
                                "level": 1,
                                "area": [
                                    { "x": 0, "y": 0 },
                                    { "x": 300, "y": 0 },
                                    { "x": 300, "y": 190 },
                                    { "x": 0, "y": 190 },
                                ],
                                "rooms": [
                                    {
                                        "id": "3b1",
                                        "name": "Sense Lab",
                                        "area": [
                                            { "x": 10, "y": 10 },
                                            { "x": 100, "y": 10 },
                                            { "x": 100, "y": 130 },
                                            { "x": 10, "y": 130 },
                                        ],
                                        "things": [
                                            {
                                                "id": "thingabc",
                                                "type": "Light",
                                                "href": "https://api.connctd.io/api/betav1/wot/things/ad4bb62b-4e95-4628-9d8b-3cd412ec140f/components/lamp/properties/on",
                                                "position": { "x": 10, "y": 10 },
                                            }
                                        ]
                                    },
                                    {
                                        "id": "3b2",
                                        "name": "FH Do Lab",
                                        "area": [
                                            { "x": 110, "y": 10 },
                                            { "x": 280, "y": 10 },
                                            { "x": 280, "y": 90 },
                                            { "x": 110, "y": 90 },
                                        ],
                                        "things": [

                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        this.state = { sites: sites };
    }

    render() {
        // offset allow us relative positioning instead of absolute positioning
        let offset = { x: 2, y: 2 };

        if (this.props.match.params.model == null) {
            return (
                <p>Error. No Model input</p>
            );
        } else {
            // TODO resolve model
            var decodedString = decodeURIComponent(this.props.match.params.model)
            decodedString = Buffer.from(decodedString, 'base64').toString('ascii');

            var canvasRef = React.createRef();
            // TODO parse model and hand over
            return (
                <div className="App">
                    <Options defaultZoom={80} canvasRef={canvasRef} />
                    <Canvas ref={canvasRef} width="80%" height="80%" data={this.state.sites} offset={offset} />
                </div>
            );
        }
    }
}
