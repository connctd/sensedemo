import { asInternalURL, getNodeOrDefault, expectType, getArrayNodeOrDefault } from './Common.js';

// parses a model and extracts all site->building->storey data
export const extractThing = (model, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting thing from model", model);

    if (isLight(model)) {
        return extractLight(model, errorCallback, warningCallback, infoCallback);
    } else if (isPositionTrackerSensor(model)) {
        return extractPositionTracker(model, errorCallback, warningCallback, infoCallback);
    } else if (isMotionSensor(model)) {
        return extractMotionSensor(model, errorCallback, warningCallback, infoCallback);
    }
    
    warningCallback("Unhandled thing type", model);
    return;
}

const isLight = (model) => {
    if (expectType(model, "iot:DimmerControl") && expectType(model, "iot:BinarySwitchControl")) {
        return true;
    }

    return false;
}

const extractLight = (model, errorCallback, warningCallback, infoCallback) => {
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "schema:name", "UnknownThing", warningCallback);
    var properties = getArrayNodeOrDefault(model, "wot:hasPropertyAffordance", [], warningCallback);

    // search for the relevant property that reflects the on off state
    var stateURL = "";
    for (var currPropertyIndex = 0; currPropertyIndex < properties.length; currPropertyIndex++) {
        var currProperty = properties[currPropertyIndex];

        if (expectType(currProperty, "iot:SwitchStatus")) {
            var form = getNodeOrDefault(currProperty, "wot:hasForm", {}, warningCallback);
            var stateTarget = getNodeOrDefault(form, "wotmedia:hasTarget", "{}", warningCallback);
            stateURL = getNodeOrDefault(stateTarget, "@id", "", warningCallback);
            break;
        }
    }

    return { "id": id, "name": name, "type": "lamp", "stateURL": asInternalURL(stateURL, "backend")};
}

const isMotionSensor = (model) => {
    if (expectType(model, "iot:MotionControl")) {
        return true;
    }

    return false;
}

const extractMotionSensor = (model, errorCallback, warningCallback, infoCallback) => {
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "schema:name", "UnknownThing", warningCallback);
    var properties = getArrayNodeOrDefault(model, "wot:hasPropertyAffordance", [], warningCallback);

    // search for the relevant property that reflects the on off state
    var stateURL = "";
    for (var currPropertyIndex = 0; currPropertyIndex < properties.length; currPropertyIndex++) {
        var currProperty = properties[currPropertyIndex];

        if (expectType(currProperty, "iot:MotionType")) {
            var form = getNodeOrDefault(currProperty, "wot:hasForm", {}, warningCallback);
            var stateTarget = getNodeOrDefault(form, "wotmedia:hasTarget", "{}", warningCallback);
            stateURL = getNodeOrDefault(stateTarget, "@id", "", warningCallback);
            break;
        }
    }

    return { "id": id, "name": name, "type": "motionsensor", "stateURL": asInternalURL(stateURL, "backend")};
}

const isPositionTrackerSensor = (model) => {
    if (expectType(model, "iot:PositionMonitoring")) {
        return true;
    }

    return false;
}

const extractPositionTracker = (model, errorCallback, warningCallback, infoCallback) => {
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "schema:name", "UnknownThing", warningCallback);
    var properties = getArrayNodeOrDefault(model, "wot:hasPropertyAffordance", [], warningCallback);

    // search for the relevant property that reflects the on off state
    var xURL = "";
    var yURL = "";
    var zURL = "";

    for (var currPropertyIndex = 0; currPropertyIndex < properties.length; currPropertyIndex++) {
        var currProperty = properties[currPropertyIndex];

        if (expectType(currProperty, "iot:PositionX")) {
            var xForm = getNodeOrDefault(currProperty, "wot:hasForm", {}, warningCallback);
            var xTarget = getNodeOrDefault(xForm, "wotmedia:hasTarget", "{}", warningCallback);
            xURL = getNodeOrDefault(xTarget, "@id", "", warningCallback);
        } else if (expectType(currProperty, "iot:PositionY")) {
            var yForm = getNodeOrDefault(currProperty, "wot:hasForm", {}, warningCallback);
            var yTarget = getNodeOrDefault(yForm, "wotmedia:hasTarget", "{}", warningCallback);
            yURL = getNodeOrDefault(yTarget, "@id", "", warningCallback);
        } else if (expectType(currProperty, "iot:PositionZ")) {
            var zForm = getNodeOrDefault(currProperty, "wot:hasForm", {}, warningCallback);
            var zTarget = getNodeOrDefault(zForm, "wotmedia:hasTarget", "{}", warningCallback);
            zURL = getNodeOrDefault(zTarget, "@id", "", warningCallback);
        }
    }

    return { "id": id, "name": name, "type": "position", "xURL": asInternalURL(xURL, "backend"), "yURL": asInternalURL(yURL, "backend"), "zURL": asInternalURL(zURL, "backend") };
}