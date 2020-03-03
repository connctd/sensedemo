import * as jsonld from 'jsonld';
import { extractSiteData } from './Converter.js';

var fetchedModel = {
    "@context": [
        "https://schema.org",
        {
            "bot":"https://w3id.org/bot#"
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
    "@type": ["bot:Site", "bot:Building"],
    "name":"MySite",
    "geo:Polygon": {
        "geo:coordinates": [
            [1.0, 2.0], [5.0, 6.0]
        ]
    },
    "bot:hasBuilding": [
        {
            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/Building",
            "@type": ["bot:Building"],
            "name": "Building",
            "geo:Polygon": {
                "geo:coordinates": [
                    [1.0, 2.0], [5.0, 6.0]
                ]
            },
            "bot:hasStorey": [
                {
                    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/Building",
                    "@type": ["bot:Storey"],
                    "name": "Etage0",
                    "geo:Polygon": {
                        "geo:coordinates": [
                            [1.0, 2.0], [5.0, 6.0]
                        ]
                    },
                    "bot:hasSpace": [
                        {
                            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/Building",
                            "@type": ["bot:Space"],
                            "name": "Room1",
                            "geo:Polygon": {
                                "geo:coordinates": [
                                    [1.0, 2.0], [5.0, 6.0]
                                ]
                            },
                        }
                    ],
                }
            ],
        }
    ],
    "bot:hasElement": [
        {
            "@type":"wot:Thing",
            "@id": "https://iktsystems.goip.de:443/ict-gw/v1/things/bla",
            "name": "test"
        }
    ]
};

// loads remote model and transforms it to a representation this visualizer can work with
export const resolveModel = async (url, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Fetched model", fetchedModel);
    var compactedModel = await getReducedModel(fetchedModel, successCallback, errorCallback, warningCallback, infoCallback);
    var extractedModel = extractSiteData(compactedModel, successCallback, errorCallback, warningCallback, infoCallback);
    successCallback("Finished", extractedModel);
};

// expands and compacts given model
const getReducedModel = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    // let all context uris point to special endpoint
    //model["@context"] = replaceContextUrls(model["@context"], errorCallback, warningCallback, infoCallback);
    model = replaceContextUrls(model, errorCallback, warningCallback, infoCallback);

    infoCallback("Applied context modifications", model);

    try {
        let expanded = await jsonld.expand(model);
        infoCallback("Model was expanded", expanded);

        let compacted = await jsonld.compact(expanded, myContext);
        infoCallback("Model was compacted", compacted);

        return compacted;
    } catch (err) {
        console.error(err);
        errorCallback("Failed to convert model", err);
    }
}

// replace context urls with the ones point to our own backend to avoid cors issues
const replaceContextUrls = (model, errorCallback, warningCallback, infoCallback) => {
    if (model === undefined) {
        warningCallback("No context value found", model);
        return "";
    }

    // context can be just a plain string
    if (typeof model === 'string' || model instanceof String) {
        if (model.startsWith("http://") || model.startsWith("https://")) {
            model = asInternalURL(model);
        }
    } else if (Array.isArray(model)) {
        // get length of model
        for (var i = 0; i < model.length; i++) {
            model[i] = replaceContextUrls(model[i], errorCallback, warningCallback, infoCallback);
        }
    } else {
        // model is an object - go through each key value pair
        var keys = Object.keys(model);
        for (var j = 0; j < keys.length; j++) {
            model[keys[j]] = replaceContextUrls(model[keys[j]], errorCallback, warningCallback, infoCallback);
        }
    }

    return model;
}

// takes a schema url, base64 and url encodes it and appends it to backend url
const asInternalURL = (input) => {
    var url = window.location.href;
    var arr = url.split("/");
    var encoded = Buffer.from(input).toString('base64');
    //return arr[0] + "//" + arr[2] + "/api/schema/" + encodeURIComponent(encoded) + "#";
    return "http://localhost:8080/api/schema/" + encodeURIComponent(encoded) + "#";
}

// schema this service is working with
var myContext = [
    {
        "schema": asInternalURL("https://schema.org/#")
    },
    {
        "bot": asInternalURL("https://w3id.org/bot#")
    },
    {
        "wot": asInternalURL("https://www.w3.org/2019/wot/td#")
    },
    {
        "geo": asInternalURL("https://purl.org/geojson/vocab#")
    }
];