import React from 'react';
import './../App.css';
import Canvas from './visualization/Canvas.js';
import Options from './control/Options.js';
import ExpandableObject from './control/ExpandableObject.js';
import { parseModel } from '../utils/Parser.js';

export default class ModelView extends React.Component {
    constructor(props) {
        super(props);

        let inputModel = {
            "@context": [
                "https://schema.org",
                {
                    "bot": "https://w3id.org/bot#"
                },
                {
                    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                },
                {
                    "wot": "https://www.w3.org/2019/wot/td#"
                },
                {
                    "prod": "https://w3id.org/product#"
                },
                {
                    "geo": "https://purl.org/geojson/vocab#"
                }
            ],
            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SenseDemoSite",
            "@type": ["bot:Site"],
            "name": "MySite",
            "geo:geometry": {
                "@type": "geo:Polygon",
                "geo:coordinates": [
                    [0, 10],
                    [600, 10],
                    [600, 300],
                    [0, 300]
                ]
            },
            "bot:hasBuilding": [
                {
                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/Building",
                    "@type": ["bot:Building"],
                    "name": "Virtual Building",
                    "geo:geometry": {
                        "@type": "geo:Polygon",
                        "geo:coordinates": [
                            [10, 10],
                            [300, 10],
                            [300, 100],
                            [450, 100],
                            [450, 200],
                            [10, 200]
                        ]
                    },
                    "bot:hasStorey": [
                        {
                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/StoreyA",
                            "@type": ["bot:Storey"],
                            "name": "Ground Floor",
                            "floorLevel": "0",
                            "geo:geometry": {
                                "@type": "geo:Polygon",
                                "geo:coordinates": [
                                    [0, 0],
                                    [300, 0],
                                    [300, 190],
                                    [0, 190],
                                ]
                            }
                        },
                        {
                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/StoreyB",
                            "@type": ["bot:Storey"],
                            "name": "First Floor",
                            "floorLevel": "1",
                            "geo:geometry": {
                                "@type": "geo:Polygon",
                                "geo:coordinates": [
                                    [0, 0],
                                    [300, 0],
                                    [300, 190],
                                    [0, 190],
                                ]
                            },
                            "bot:hasSpace": [
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SpaceA",
                                    "@type": ["bot:Space"],
                                    "name": "Sense Lab",
                                    "geo:geometry": {
                                        "@type": "geo:Polygon",
                                        "geo:coordinates": [
                                            [10, 10],
                                            [100, 10],
                                            [100, 130],
                                            [10, 130]
                                        ]
                                    },
                                    "bot:hasElement": [
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/bla",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [1.0, 2.0]
                                            },
                                        }
                                    ]
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SpaceC",
                                    "@type": ["bot:Space"],
                                    "name": "FH Do Lab",
                                    "geo:geometry": {
                                        "@type": "geo:Polygon",
                                        "geo:coordinates": [
                                            [110, 10],
                                            [280, 10],
                                            [280, 90],
                                            [110, 90],
                                        ]
                                    },
                                    "bot:hasElement": [
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/bla",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [1.0, 2.0]
                                            },
                                        }
                                    ]
                                }, {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SpaceB",
                                    "@type": ["bot:Space"],
                                    "name": "Corridor",
                                    "geo:geometry": {
                                        "@type": "geo:Polygon",
                                        "geo:coordinates": [
                                            [10, 140],
                                            [110, 140],
                                            [110, 100],
                                            [430, 100],
                                            [430, 180],
                                            [10, 180]
                                        ]
                                    }
                                }

                            ]
                        }
                    ]
                }
            ]
        };

        this.canvasArea = React.createRef();

        this.state = { inputModel: inputModel, outputModel: null, logEntries: [] };

        this.onParseError = this.onParseError.bind(this);
        this.onParseWarning = this.onParseWarning.bind(this);
        this.onParseInfo = this.onParseInfo.bind(this);
        this.onParseSuccess = this.onParseSuccess.bind(this);
        this.onFetchedModelChanged = this.onFetchedModelChanged.bind(this);

        // get link to model and parse it
        var decodedString = decodeURIComponent(this.props.match.params.model)
        decodedString = Buffer.from(decodedString, 'base64').toString('ascii');
        console.log(decodedString);
    }

    onParseError(message, obj) {
        this.addLogEntry("err", message, obj);
    }

    onParseWarning(message, obj) {
        this.addLogEntry("warn", message, obj);
    }

    onParseInfo(message, obj) {
        this.addLogEntry("info", message, obj);
    }

    onParseSuccess(message, obj) {
        this.addLogEntry("info", message, obj);

        var newState = this.state;
        newState.outputModel = obj;

        this.setState(newState);
    }

    // triggered when edited
    onFetchedModelChanged(newModel) {
        var parsedModel;
        var e;

        try {
            parsedModel = JSON.parse(newModel);    
        } catch (err) {
            console.error(err);
            e = err;
        }

        var newState = this.state;
        newState.inputModel = parsedModel;
        newState.logEntries = [];
        this.setState(newState);
        
        if (parsedModel !== undefined) {
            parseModel(parsedModel, this.onParseSuccess, this.onParseError, this.onParseWarning, this.onParseInfo);
        } else {
            this.onParseError("Model seems to be invalid", { "msg": e + ""});
        }
    }

    addLogEntry(severity, message, obj) {
        var newDate = new Date();
        var dateString = newDate.toUTCString();
        
        var newState = this.state;
        newState.logEntries.push(<ExpandableObject
            key={newState.logEntries.length + "-" + dateString}
            severity={severity}
            message={message}
            json={obj != null ? JSON.stringify(obj, null, 4) : null} 
        />);
        this.setState(newState);
    }

    componentDidMount() {
        parseModel(this.state.inputModel, this.onParseSuccess, this.onParseError, this.onParseWarning, this.onParseInfo);
    }

    render() {
        // offset allow us relative positioning instead of absolute positioning
        let offset = { x: 2, y: 2 };

        if (this.props.match.params.model == null) {
            return (
                <p>Error. No Model input</p>
            );
        } else {
            return (
                <div className="App">
                    <Options defaultZoom={80} canvasRef={this.canvasArea} model={this.state.inputModel} modelChangeHandler={this.onFetchedModelChanged} />
                    <Canvas ref={this.canvasArea} width="80%" height="80%" model={this.state.outputModel} offset={offset} />
                    
                    <div className="LogView">
                        <h1>Log</h1>
                        {this.state.logEntries.map(obj => obj)}
                    </div>
                </div>
            );
        }
    }
}
