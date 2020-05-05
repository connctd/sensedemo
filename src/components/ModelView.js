import React from 'react';
import './../App.css';
import Canvas from './visualization/Canvas.js';
import Options from './control/Options.js';
import ModelLog from './control/ModelLog.js';
import MouseInputHandler from './control/MouseInputHandler.js';
import NotificationLog from './control/NotificationLog.js';
import ControlLights from './rules/ControlLights.js';
import EventBus from './detection/EventBus.js';
import UserTracker from './detection/UserTracker.js';
import MotionTracker from './detection/MotionTracker';
import ExpandableObject from './control/ExpandableObject.js';
import { parseModel } from '../utils/LocationParser.js';


export default class ModelView extends React.Component {
    constructor(props) {
        super(props);
        let inputModel = {
            "@context": [
                "https://schema.org/",
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
            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite",
            "@type": [
                "bot:Site"
            ],
            "name": "Sense demo site v0.1",
            "bot:hasBuilding": [
                {
                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding",
                    "@type": [
                        "bot:Building"
                    ],
                    "name": "Residential building",
                    "bot:hasStorey": [
                        {
                            "floorLevel": "1",
                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor",
                            "@type": [
                                "bot:Storey"
                            ],
                            "name": "First floor",
                            "bot:hasSpace": [
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/bedroom",
                                    "@type": [
                                        "bot:Space"
                                    ],
                                    "name": "Bedroom (ICT Lab Dortmund)",
                                    "bot:hasElement": [
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/11a5423995d544c6",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    0.0,
                                                    55.0
                                                ],
                                                "@id": "point:e6302ffa-74bc-4d4f-bef8-055966ac7d79",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/59b65e47738a439d",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    90.0,
                                                    45.0
                                                ],
                                                "@id": "point:d622b7e3-b65e-4d3b-b0a3-9b98928ce966",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/763f6af05bafd267",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    90.0,
                                                    75.0
                                                ],
                                                "@id": "point:0626240a-e8bb-4425-8155-541b877366f4",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        }
                                    ],
                                    "geo:geometry": {
                                        "geo:coordinates": [
                                            [
                                                0.0,
                                                0.0
                                            ],
                                            [
                                                185.0,
                                                0.0
                                            ],
                                            [
                                                185.0,
                                                125.0
                                            ],
                                            [
                                                0.0,
                                                125.0
                                            ]
                                        ],
                                        "@id": "polygon:8c11cd1c-b3b9-419b-beef-b516f65d76a0",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/livingroom",
                                    "@type": [
                                        "bot:Space"
                                    ],
                                    "name": "Livingroom (Sense Lab Berlin)",
                                    "bot:hasElement": [
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/c3931427-a8d9-47f3-8f54-6f3df91ee07e",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    160.0,
                                                    5.0
                                                ],
                                                "@id": "point:872475c7-540b-4be4-9925-edb175cb2a34",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/1baf5841-15c9-4a65-be77-67b3d8445a61",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    80.0,
                                                    55.0
                                                ],
                                                "@id": "point:c4b6c630-036b-42c6-a0a0-eba7a4b6beb3",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/f97f2adb-8429-4e28-9774-c952b2dff96d",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    160.0,
                                                    80.0
                                                ],
                                                "@id": "point:0a2239d0-9ac5-4236-a6bc-162a261213ce",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/41be9037-d802-4509-895b-ddac5452db53",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    90.0,
                                                    65.0
                                                ],
                                                "@id": "point:10ef7519-e30a-4cd3-bd9a-96c4db1ea884",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        }
                                    ],
                                    "geo:geometry": {
                                        "geo:coordinates": [
                                            [
                                                190.0,
                                                0.0
                                            ],
                                            [
                                                375.0,
                                                0.0
                                            ],
                                            [
                                                375.0,
                                                125.0
                                            ],
                                            [
                                                190.0,
                                                125.0
                                            ]
                                        ],
                                        "@id": "polygon:7528953e-af92-4a3e-bf57-9f36d306a68b",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/kitchen",
                                    "@type": [
                                        "bot:Space"
                                    ],
                                    "name": "Kitchen",
                                    "bot:hasElement": [
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/81f1d73750e7495e",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    60.0,
                                                    35.0
                                                ],
                                                "@id": "point:144be703-98d9-4650-9e1d-b181a672eb8f",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/906f4202b77b42fe",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    3.0,
                                                    3.0
                                                ],
                                                "@id": "point:5487618b-9aa4-4786-b0f2-a072a8cc595e",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/2bf5bf8c8f724adc",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    0.0,
                                                    70.0
                                                ],
                                                "@id": "point:0ca9f617-578f-491f-a4cb-d63b19a71e0e",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        }
                                    ],
                                    "geo:geometry": {
                                        "geo:coordinates": [
                                            [
                                                0.0,
                                                130.0
                                            ],
                                            [
                                                135.0,
                                                130.0
                                            ],
                                            [
                                                135.0,
                                                220.0
                                            ],
                                            [
                                                0.0,
                                                220.0
                                            ]
                                        ],
                                        "@id": "polygon:ed58eca8-173f-4bb3-9094-bc659b90f018",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/bathroom",
                                    "@type": [
                                        "bot:Space"
                                    ],
                                    "name": "Bathroom",
                                    "geo:geometry": {
                                        "geo:coordinates": [
                                            [
                                                240.0,
                                                130.0
                                            ],
                                            [
                                                375.0,
                                                130.0
                                            ],
                                            [
                                                375.0,
                                                175.0
                                            ],
                                            [
                                                240.0,
                                                175.0
                                            ]
                                        ],
                                        "@id": "polygon:6596a149-8579-43c7-a4a7-898c5ed132f1",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/corridor",
                                    "@type": [
                                        "bot:Space"
                                    ],
                                    "name": "Corridor",
                                    "bot:hasElement": [
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/ed2f1fb3-cbf8-479e-99bb-ef9968e5eed6",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    40.0,
                                                    35.0
                                                ],
                                                "@id": "point:49cd5503-a683-450d-b6bc-6af6376c432f",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/20b4583d-2cdf-4b86-9b99-58bcfb8ea988",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    70.0,
                                                    3.0
                                                ],
                                                "@id": "point:80336697-2b86-43b3-b9ee-517dd4a0fc69",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "bot:Element",
                                                "wot:Thing"
                                            ],
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/d60014ef-01ee-486e-9de2-fddfafe590bc",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    0.0,
                                                    70.0
                                                ],
                                                "@id": "point:6da5cd34-f281-4807-8fde-d5398dc99d67",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        }
                                    ],
                                    "geo:geometry": {
                                        "geo:coordinates": [
                                            [
                                                140.0,
                                                130.0
                                            ],
                                            [
                                                235.0,
                                                130.0
                                            ],
                                            [
                                                235.0,
                                                220.0
                                            ],
                                            [
                                                140.0,
                                                220.0
                                            ]
                                        ],
                                        "@id": "polygon:6f8d5c3d-6d42-4516-9df5-b89a43f80bed",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/stairwell",
                                    "@type": [
                                        "bot:Space"
                                    ],
                                    "name": "Stairwell",
                                    "geo:geometry": {
                                        "geo:coordinates": [
                                            [
                                                240.0,
                                                180.0
                                            ],
                                            [
                                                375.0,
                                                180.0
                                            ],
                                            [
                                                375.0,
                                                220.0
                                            ],
                                            [
                                                240.0,
                                                220.0
                                            ]
                                        ],
                                        "@id": "polygon:539668a8-631f-4bbc-935d-5f3a3b1092ce",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                }
                            ],
                            "geo:geometry": {
                                "geo:coordinates": [
                                    [
                                        10.0,
                                        10.0
                                    ],
                                    [
                                        405.0,
                                        10.0
                                    ],
                                    [
                                        405.0,
                                        250.0
                                    ],
                                    [
                                        10.0,
                                        250.0
                                    ]
                                ],
                                "@id": "polygon:ddab9436-d1cf-42b3-839d-8d649c15d1cc",
                                "@type": [
                                    "https://purl.org/geojson/vocab#Polygon"
                                ]
                            }
                        }
                    ],
                    "geo:geometry": {
                        "geo:coordinates": [
                            [
                                10.0,
                                10.0
                            ],
                            [
                                405.0,
                                10.0
                            ],
                            [
                                405.0,
                                250.0
                            ],
                            [
                                10.0,
                                250.0
                            ]
                        ],
                        "@id": "polygon:61a5ccbf-66d3-437d-90ec-5e9429ca727f",
                        "@type": [
                            "https://purl.org/geojson/vocab#Polygon"
                        ]
                    }
                }
            ],
            "geo:geometry": {
                "geo:coordinates": [
                    [
                        0.0,
                        10.0
                    ],
                    [
                        600.0,
                        10.0
                    ],
                    [
                        600.0,
                        300.0
                    ],
                    [
                        0.0,
                        300.0
                    ]
                ],
                "@id": "polygon:fb2efec0-ad81-44ad-84f2-5cd0d6b2abe1",
                "@type": [
                    "https://purl.org/geojson/vocab#Polygon"
                ]
            }
        };

        this.canvasAreaRef = React.createRef();
        this.eventBusRef = React.createRef();
        this.detectionUserTrackerRef = React.createRef();
        this.detectionMotionTrackerRef = React.createRef();
        this.mouseInputHandlerRef = React.createRef();

        this.state = { inputModel: inputModel, outputModel: null, logEntries: [], notificationEntries: [] };

        this.onParseError = this.onParseError.bind(this);
        this.onParseWarning = this.onParseWarning.bind(this);
        this.onParseInfo = this.onParseInfo.bind(this);
        this.onParseSuccess = this.onParseSuccess.bind(this);
        this.onParseNotification = this.onParseNotification.bind(this);
        this.onFetchedModelChanged = this.onFetchedModelChanged.bind(this);

        // get link to model and parse it
        var decodedString = decodeURIComponent(this.props.match.params.model)
        decodedString = Buffer.from(decodedString, 'base64').toString('ascii');
        console.log(decodedString);
    }

    onParseError(message, obj) {
        console.error(message, obj);
        this.addLogEntry("err", message, obj);
    }

    onParseWarning(message, obj) {
        console.warn(message, obj);
        this.addLogEntry("warn", message, obj);
    }

    onParseInfo(message, obj) {
        console.info(message, obj);
        this.addLogEntry("info", message, obj);
    }

    onParseNotification(message, obj) {
        console.info(message, obj);
        this.addNotificationEntry("info", message, obj);
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
            parseModel(parsedModel, this.onParseSuccess, this.onParseError, this.onParseWarning, this.onParseInfo, this.onParseNotification);
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

    addNotificationEntry(severity, message, obj) {
        var newState = this.state;
        newState.notificationEntries.push(<ExpandableObject
            key={"notification-" + newState.notificationEntries.length}
            severity={severity}
            message={message}
            json={obj != null ? JSON.stringify(obj, null, 4) : null}
        />);
        this.setState(newState);
    }

    componentDidMount() {
        parseModel(this.state.inputModel, this.onParseSuccess, this.onParseError, this.onParseWarning, this.onParseInfo, this.onParseNotification);
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
                    <MouseInputHandler ref={this.mouseInputHandlerRef} scale="80" model={this.state.outputModel} />
                    <Canvas ref={this.canvasAreaRef} scale="80" model={this.state.outputModel} mouseInputHandlerRef={this.mouseInputHandlerRef} offset={offset} />
                    <ModelLog entries={this.state.logEntries} />
                    <NotificationLog entries={this.state.notificationEntries} />
                    <EventBus ref={this.eventBusRef} />
                    <UserTracker ref={this.detectionUserTrackerRef} model={this.state.outputModel} offset={offset} eventBusRef={this.eventBusRef}/>
                    <MotionTracker ref={this.detectionMotionTrackerRef} model={this.state.outputModel} offset={offset} eventBusRef={this.eventBusRef} />
                    <ControlLights eventBusRef={this.eventBusRef} model={this.state.outputModel} offset={offset} />
                    <Options
                        defaultZoom={80}
                        detectionMotionTrackerRef={this.detectionMotionTrackerRef}
                        detectionUserTrackerRef={this.detectionUserTrackerRef}
                        mouseInputHandlerRef={this.mouseInputHandlerRef}
                        canvasRef={this.canvasAreaRef}
                        model={this.state.inputModel}
                        modelChangeHandler={this.onFetchedModelChanged}
                    />
                </div>
            );
        }
    }
}
