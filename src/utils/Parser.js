import * as jsonld from 'jsonld';

var context = {
    "name": "http://schema.org/name",
    "homepage": { "@id": "http://schema.org/url", "@type": "@id" },
    "image": { "@id": "http://schema.org/image", "@type": "@id" }
};


var model = {
    "@context": [
        "https://w3c-lbd-cg.github.io/bot/#",
        {
            "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        },
        {
            "wot": "https://www.w3.org/2019/wot/td#"
        },
        {
            "prod": "https://w3id.org/product#"
        }
    ],
    "@id": "https://iktsystems.goip.de:443/ict-gw/v1/location/SenseDemoSite",
    "name":"test",
    "wot:properties": [],
    "containsZone": [
    ]
};

// loads remote model and transforms it to a representation this visualizer can work with
export const resolveModel = async (url, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Modifying context", model);

    // TODO query model
    model["@context"] = replaceContextUrls(model["@context"], errorCallback, warningCallback, infoCallback);

    try {
        let response = await jsonld.expand(model);
        successCallback(response);
    } catch (err) {
        console.error(err);
        successCallback(err);
    }
    
/*
    var response = testInput;

    var resultingSites = [];

    if (Array.isArray(response)) {
        for (var i = 0; i < response.length; i++) {
            resolveSite(response[i], resultingSites, errorCallback, warningCallback);
        }
    } else {
        resolveSite(response, resultingSites, errorCallback, warningCallback);
    }
*/
    
};

// replace context urls with the ones point to our own backend to avoid cors issues
const replaceContextUrls = (model, errorCallback, warningCallback, infoCallback) => {
    if (model === undefined) {
        warningCallback("No context value found", model);
        return "";
    }

    // context can be just a plain string
    if (typeof model === 'string' || model instanceof String) {
        if (model.startsWith("http://") || model.startsWith("https://")) {
            model = replaceSchemaUrl(model);
        }
    } else if (Array.isArray(model)) {
        // get length of model
        for (var i = 0; i < model.length; i++) {
            model[i] = replaceContextUrls(model[i], errorCallback, warningCallback, infoCallback);
        }
    } else {
        // model is an object - go through each key value pair
        var keys = Object.keys(model);
        for (var i = 0; i < keys.length; i++) {
            model[keys[i]] = replaceContextUrls(model[keys[i]], errorCallback, warningCallback, infoCallback);
        }
    }

    return model;
}

// takes a schema url, base64 and url encodes it and appends it to backend url
const replaceSchemaUrl = (input) => {
    var url = window.location.href;
    var arr = url.split("/");
    var encoded = Buffer.from(input).toString('base64');
    return arr[0] + "//" + arr[2] + "/api/schema/" + encodeURIComponent(encoded);
    //return "http://localhost:8080/api/schema/" + encodeURIComponent(encoded);
}