
// can be used to wrap a remote endpoint into local service call which then gets redirected
export const asInternalURL = (input, prefix) => {
    var url = window.location.href;
    var arr = url.split("/");
    var encoded = Buffer.from(input).toString('base64');

    // ignore local api addresses
    //if (input.startsWith("http://192.168.") || input.startsWith("http://10.")) {
    //    return input;
    //} else {
        if (url.includes("localhost")) {
            return "http://localhost:8080/api/" + prefix + "?data=" + encodeURIComponent(encoded) + "#";
        } else {
            return arr[0] + "//" + arr[2] + "/api/" + prefix + "?data=" + encodeURIComponent(encoded) + "#";
        }
    //}
}

// can be used to load remote json objects for schemata or wot tds
export const loadDocument = async (url, headers) => {
    var resp;
    try {
        resp = await fetch(url, {
            redirect: "follow",
            headers: headers,
        });
    } catch(err) {
        console.error("Failed to resolve "+ url +". Reason:" + err);
    }

    if (resp === undefined) {
        console.log("Trying to use own backend as fallback");
        
        try {
            resp = await fetch(asInternalURL(url, "schema"), {
                redirect: "follow",
                headers: headers,
            });
        } catch (err) {
            console.error("Fallback has failed");
        }
    }

    var jsonResp = await resp.json();
    return jsonResp;
}


// resolves model[field] or returns default if not found
export const getNodeOrDefault = (model, field, defaultValue, warningCallback) => {
    var fieldValue = model[field];
    if (fieldValue === undefined) {
        warningCallback("Node has no field " + field, model);
        return defaultValue;
    }

    return fieldValue;
}

export const getArrayNodeOrDefault = (model, field, defaultValue, warningCallback) => {
    var fieldValue = model[field];
    if (fieldValue === undefined) {
        warningCallback("Node has no field " + field, model);
        return defaultValue;
    }

    if (!Array.isArray(fieldValue)) {
        return [fieldValue];
    }

    return fieldValue;
}

// checks if @type is or contains expected type
export const expectType = (model, expectedType) => {
    var modelType = model["@type"];
    if (modelType === undefined) {
        return false;
    }

    if (typeof modelType === 'string' || modelType instanceof String) {
        return (modelType === expectedType);
    } else if (Array.isArray(modelType)) {
        for (var i = 0; i < modelType.length; i++) {
            if (modelType[i] === expectedType) {
                return true;
            }
        }
    }

    return false;
}


// schema this service is working with
export var locationsContext = [
    {
        "schema": "http://schema.org/"
    },
    {
        "bot": "https://w3id.org/bot#"
    },
    {
        "wot": "https://www.w3.org/2019/wot/td#"
    },
    {
        "geo": "https://purl.org/geojson/vocab#"
    },
    {
        "id": "https://schema.org/identifier"
    }
];

export var wotContext = [
    {
        "schema": "https://schema.org/#"
    },
    {
        "wot": "https://www.w3.org/2019/wot/td#"
    },
    {
        "wotmedia": "https://www.w3.org/2019/wot/hypermedia#"
    },
    {
        "wotschema": "https://www.w3.org/2019/wot/json-schema#"
    },
    {
        "iot": "http://iotschema.org/"
    },
    {
        "saref":"https://w3id.org/saref#"
    },
    {
        "purl":"http://purl.org/dc/terms/"
    },
    {
        "type":"http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
    }
];
