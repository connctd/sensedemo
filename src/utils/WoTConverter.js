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
    var actions = getArrayNodeOrDefault(model, "wot:hasActionAffordance", [], warningCallback);

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

    var switchURL = "";
    for (var currActionIndex = 0; currActionIndex < actions.length; currActionIndex++) {
        var currAction = actions[currActionIndex];

        if (expectType(currAction, "iot:TurnOn")) {
            var actionForm = getNodeOrDefault(currAction, "wot:hasForm", {}, warningCallback);
            var input = getNodeOrDefault(currAction, "wot:hasInputSchema", {}, warningCallback);
            var props = getArrayNodeOrDefault(input, "wotschema:properties", [], warningCallback);
            var target = getNodeOrDefault(actionForm, "wotmedia:hasTarget", "{}", warningCallback);

            if (props.length !== 1) {
                console.log("Sorting out action " + currAction["@index"] +" since it doesn't look like a simple turn on/off action");
                continue;
            }

            switchURL = getNodeOrDefault(target, "@id", "", warningCallback);
        }
    }

    return { "id": id, "name": name, "type": "lamp", "stateURL": asInternalURL(stateURL, "backend"), "switchURL": asInternalURL(switchURL, "backend")};
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

// given a fully converted model search for a thing with type position
export const findPositionTracker = (model) => {
    for (var sID = 0; sID < model.length; sID++) {
        var currSite = model[sID];
        for (var bID = 0; bID < currSite.buildings.length; bID++) {
            var currBuilding = currSite.buildings[bID];
            for (var eID = 0; eID < currBuilding.storeys.length; eID++) {
                var currStorey = currBuilding.storeys[eID];
                for (var rID = 0; rID < currStorey.rooms.length; rID++) {
                    var currRoom = currStorey.rooms[rID];
                    for (var tID = 0; tID < currRoom.things.length; tID++) {
                        var currThing = currRoom.things[tID];
                        if (currThing.details.type === "position") {
                            return currThing;
                        }
                    }
                }
            }
        }
    }

    return;
}