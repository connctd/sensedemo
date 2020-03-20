import React from 'react';
import './../App.css';
import Canvas from './visualization/Canvas.js';
import Options from './control/Options.js';
import ModelLog from './control/ModelLog.js';
import Algorithm from './algorithm/Algorithm.js';
import ExpandableObject from './control/ExpandableObject.js';
import { parseModel } from '../utils/LocationParser.js';
import { findPositionTracker } from '../utils/WoTConverter.js';
import { asInternalURL } from '../utils/Common.js';


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
            "@id": "https://iktsystems.goip.de:443/ict-gw/v1senseDemoSite",
            "@type": [
                "https://w3id.org/bot#Site"
            ],
            "name": "Sense demo site v0.1",
            "bot:hasBuilding": [
                {
                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding",
                    "@type": [
                        "https://w3id.org/bot#Building"
                    ],
                    "name": "Residential building",
                    "bot:hasStorey": [
                        {
                            "floorLevel": "1",
                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor",
                            "@type": [
                                "https://w3id.org/bot#Storey"
                            ],
                            "name": "First floor",
                            "bot:hasSpace": [
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/bedroom",
                                    "@type": [
                                        "https://w3id.org/bot#Space"
                                    ],
                                    "name": "Bedroom",
                                    "bot:hasElement": [
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/20b4583d-2cdf-4b86-9b99-58bcfb8ea988",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [2.0, 2.0]
                                            },
                                        },
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/41be9037-d802-4509-895b-ddac5452db53",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [0.0, 50.0]
                                            }
                                        },
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/c3931427-a8d9-47f3-8f54-6f3df91ee07e",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [2.0, 100.0]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "https://w3id.org/bot#Element",
                                                "https://www.w3.org/2019/wot/td#Thing"
                                            ],
                                            "@id": "https://localhost:8092/thing/11a5423995d544c6",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    0.0,
                                                    55.0
                                                ],
                                                "@id": "point:b3ff2ec7-43d7-48a3-821c-8ee5e51c4951",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "https://w3id.org/bot#Element",
                                                "https://www.w3.org/2019/wot/td#Thing"
                                            ],
                                            "@id": "https://localhost:8092/thing/59b65e47738a439d",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    90.0,
                                                    55.0
                                                ],
                                                "@id": "point:511659c8-31ab-437e-89aa-b03a54dec0c8",
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
                                        "@id": "polygon:215ac979-b525-4bfd-8a9b-cb1bcb945bc6",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/livingroom",
                                    "@type": [
                                        "https://w3id.org/bot#Space"
                                    ],
                                    "name": "Livingroom",
                                    "bot:hasElement": [
                                        {
                                            "@type": [
                                                "https://w3id.org/bot#Element",
                                                "https://www.w3.org/2019/wot/td#Thing"
                                            ],
                                            "@id": "https://localhost:8092/thing/906f4202b77b42fe",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    170.0,
                                                    0.0
                                                ],
                                                "@id": "point:d9bc7338-2cbe-4ebb-9f97-e9789b6eba4f",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "https://w3id.org/bot#Element",
                                                "https://www.w3.org/2019/wot/td#Thing"
                                            ],
                                            "@id": "https://localhost:8092/thing/81f1d73750e7495e",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    80.0,
                                                    55.0
                                                ],
                                                "@id": "point:589a6d4c-48bb-4224-bca1-bd8a447de299",
                                                "@type": [
                                                    "https://purl.org/geojson/vocab#Point"
                                                ]
                                            }
                                        },
                                        {
                                            "@type": [
                                                "https://w3id.org/bot#Element",
                                                "https://www.w3.org/2019/wot/td#Thing"
                                            ],
                                            "@id": "https://localhost:8092/thing/2bf5bf8c8f724adc",
                                            "geo:geometry": {
                                                "geo:coordinates": [
                                                    170.0,
                                                    80.0
                                                ],
                                                "@id": "point:cf8f706b-0e8f-43e2-b5df-fefaca7e5b22",
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
                                        "@id": "polygon:14235f56-41f2-437f-adfb-616d4074439e",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/kitchen",
                                    "@type": [
                                        "https://w3id.org/bot#Space"
                                    ],
                                    "name": "Kitchen",
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
                                        "@id": "polygon:02f520c2-a8d7-41dd-8fef-e3bfb24b37ac",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/bathroom",
                                    "@type": [
                                        "https://w3id.org/bot#Space"
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
                                        "@id": "polygon:194a7e14-b0e4-4fb7-9c25-0ba7ca44d034",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/corridor",
                                    "@type": [
                                        "https://w3id.org/bot#Space"
                                    ],
                                    "name": "Corridor",
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
                                        "@id": "polygon:803d265f-1348-45f7-965f-92de79bf8c81",
                                        "@type": [
                                            "https://purl.org/geojson/vocab#Polygon"
                                        ]
                                    }
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/sites/senseDemoSite/buildings/residentialBuilding/storeys/firstFloor/spaces/stairwell",
                                    "@type": [
                                        "https://w3id.org/bot#Space"
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
                                        "@id": "polygon:261232d0-1225-4866-b7a6-8a70326aede0",
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
                                "@id": "polygon:2112ca84-ce86-4dd9-9d92-5444352021b1",
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
                        "@id": "polygon:3bf28da4-a96f-4d16-a55d-a9db5a16366a",
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
                "@id": "polygon:7298eede-140f-4b61-9188-8d58fe343aab",
                "@type": [
                    "https://purl.org/geojson/vocab#Polygon"
                ]
            }
        };

        let inputModel1 = {
            "@context": [
                "https://w3id.org/bot#",
                {
                    "schema": "http://schema.org/"
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
            "@type": ["Site"],
            "schema:name": "MySite",
            "geo:geometry": {
                "@type": "geo:Polygon",
                "geo:coordinates": [
                    [0, 10],
                    [600, 10],
                    [600, 300],
                    [0, 300]
                ]
            },
            "hasBuilding": [
                {
                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/Building",
                    "@type": ["Building"],
                    "schema:name": "Virtual Building",
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
                    "hasStorey": [
                        {
                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/StoreyA",
                            "@type": ["Storey"],
                            "schema:name": "Ground Floor",
                            "schema:floorLevel": "0",
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
                            "@type": ["Storey"],
                            "schema:name": "First Floor",
                            "schema:floorLevel": "1",
                            "geo:geometry": {
                                "@type": "geo:Polygon",
                                "geo:coordinates": [
                                    [0, 0],
                                    [300, 0],
                                    [300, 190],
                                    [0, 190],
                                ]
                            },
                            "hasSpace": [
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SpaceA",
                                    "@type": ["Space"],
                                    "schema:name": "Sense Lab",
                                    "geo:geometry": {
                                        "@type": "geo:Polygon",
                                        "geo:coordinates": [
                                            [10, 10],
                                            [100, 10],
                                            [100, 130],
                                            [10, 130]
                                        ]
                                    },
                                    "hasElement": [
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/20b4583d-2cdf-4b86-9b99-58bcfb8ea988",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [2.0, 2.0]
                                            },
                                        },
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/41be9037-d802-4509-895b-ddac5452db53",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [0.0, 50.0]
                                            }
                                        },
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/c3931427-a8d9-47f3-8f54-6f3df91ee07e",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [2.0, 100.0]
                                            }
                                        }
                                    ]
                                },
                                {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SpaceC",
                                    "@type": ["bot:Space"],
                                    "schema:name": "FH Do Lab",
                                    "geo:geometry": {
                                        "@type": "geo:Polygon",
                                        "geo:coordinates": [
                                            [110, 10],
                                            [280, 10],
                                            [280, 90],
                                            [110, 90],
                                        ],
                                    "hasElement": [
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/20b4583d-2cdf-4b86-9b99-58bcfb8ea988",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [2.0, 2.0]
                                            },
                                        },
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/41be9037-d802-4509-895b-ddac5452db53",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [0.0, 50.0]
                                            }
                                        },
                                        {
                                            "@type": "wot:Thing",
                                            "@id": "https://api.connctd.io/api/betav1/wot/tds/c3931427-a8d9-47f3-8f54-6f3df91ee07e",
                                            "geo:geometry": {
                                                "@type": "geo:Point",
                                                "geo:coordinates": [2.0, 100.0]
                                            }
                                        }
                                    ]
                                    }
                                }, {
                                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SpaceB",
                                    "@type": ["bot:Space"],
                                    "schema:name": "Corridor",
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
        this.onFakeUserPositionSet = this.onFakeUserPositionSet.bind(this);

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

    async onFakeUserPositionSet(pos) {
        var tracker = findPositionTracker(this.state.outputModel);
        
        if (tracker === undefined) {
            console.error("Model has no position tracker. Unable to set position");
            return;
        }

        var xconfig = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "value": pos.x.toString() })
        }

        var yconfig = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "value": pos.y.toString() })
        }

        var xURL = "https://api.connctd.io/api/v1/things/a359ce93-098c-41ec-9ef1-8c2846d258f7/components/tracker/properties/x";
        var yURL = "https://api.connctd.io/api/v1/things/a359ce93-098c-41ec-9ef1-8c2846d258f7/components/tracker/properties/y";
        
        var respX = await fetch(asInternalURL(xURL, "backend"), xconfig);
        var respY = await fetch(asInternalURL(yURL, "backend"), yconfig);
        
        if (respX.status !== 204 && respY.status !== 204) {
            console.error("Bad response");
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
                    <Canvas ref={this.canvasArea} scale="80" model={this.state.outputModel} offset={offset} fakePositionSetHandler={this.onFakeUserPositionSet}/>
                    <ModelLog entries={this.state.logEntries} />
                    <Algorithm model={this.state.outputModel} offset={offset} />
                </div>
            );
        }
    }
}
