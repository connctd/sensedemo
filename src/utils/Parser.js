import * as jsonld from 'jsonld';
import { extractSiteData } from './Converter.js';


// loads remote model and transforms it to a representation this visualizer can work with
export const parseModel = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Parsing model", model);
    var compactedModel = await getReducedModel(model, successCallback, errorCallback, warningCallback, infoCallback);

    if (compactedModel !== undefined) {
        var extractedModel = extractSiteData(compactedModel, successCallback, errorCallback, warningCallback, infoCallback);
        successCallback("Finished", extractedModel);
    }
};

// expands and compacts given model
const getReducedModel = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    if (model === undefined || model["@context"] === undefined) {
        errorCallback("Model has no context", model);
        return;
    }

    // let all context uris point to special endpoint
    model["@context"] = localizeUrls(model["@context"], errorCallback, warningCallback, infoCallback);

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
const localizeUrls = (model, errorCallback, warningCallback, infoCallback) => {
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
            model[i] = localizeUrls(model[i], errorCallback, warningCallback, infoCallback);
        }
    } else {
        // model is an object - go through each key value pair
        var keys = Object.keys(model);
        for (var j = 0; j < keys.length; j++) {
            model[keys[j]] = localizeUrls(model[keys[j]], errorCallback, warningCallback, infoCallback);
        }
    }

    return model;
}

// takes a schema url, base64 and url encodes it and appends it to backend url
const asInternalURL = (input) => {
    var url = window.location.href;
    var arr = url.split("/");
    var encoded = Buffer.from(input).toString('base64');

    if (url.includes("localhost")) {
        return "http://localhost:8080/api/schema?data=" + encodeURIComponent(encoded) + "#";
    } else {
        return arr[0] + "//" + arr[2] + "/api/schema/" + encodeURIComponent(encoded) + "#";
    }
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