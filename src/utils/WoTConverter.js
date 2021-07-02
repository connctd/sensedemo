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
    } else if (isSwitch(model)) {
        return extractSwitch(model, errorCallback, warningCallback, infoCallback);
    }
    
    warningCallback("Unhandled thing type", model);
    return;
}

const isLight = (model) => {
    if ((expectType(model, "iot:DimmerControl") && expectType(model, "iot:BinarySwitchControl")) || expectType(model, "saref:LightingDevice")) {
        return true;
    }

    return false;
}

const extractLight = (model, errorCallback, warningCallback, infoCallback) => {
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "purl:title", "UnknownThing", warningCallback);
    var properties = getArrayNodeOrDefault(model, "wot:hasPropertyAffordance", [], warningCallback);
    var actions = getArrayNodeOrDefault(model, "wot:hasActionAffordance", [], warningCallback);

    // search for the relevant property that reflects the on off state
    var stateURL = "";
    var stateProperty = "";
    for (var currPropertyIndex = 0; currPropertyIndex < properties.length; currPropertyIndex++) {
        var currProperty = properties[currPropertyIndex];

        if (expectType(currProperty, "iot:SwitchStatus") && !expectType(currProperty, "iot:Timeseries")) {
            // we need to figure out which name the property has
            var propertyFields = getArrayNodeOrDefault(currProperty, "wotschema:properties", [], warningCallback);
            for (var currFieldIndex = 0; currFieldIndex < propertyFields.length; currFieldIndex++) {

                var currPropertyField = propertyFields[currFieldIndex];
                
                if (expectType(currPropertyField, "iot:StatusData")) {
                    stateProperty = getNodeOrDefault(currPropertyField, "wotschema:propertyName", "", warningCallback);
                    break;
                }
            }

            if (stateProperty === "") {
                errorCallback("Lamp has no property output with type iot:StatusData", currProperty);
            }


            var form = getFormWithType(currProperty, "wot:readProperty", warningCallback);
            var stateTarget = getNodeOrDefault(form, "wotmedia:hasTarget", "{}", warningCallback);
            stateURL = getNodeOrDefault(stateTarget, "@id", "", warningCallback);
            
            break;
        }
    }

    var switchURL = "";
    var switchProperty = "";
    for (var currActionIndex = 0; currActionIndex < actions.length; currActionIndex++) {
        var currAction = actions[currActionIndex];

        if (expectType(currAction, "iot:TurnOn")) {
            // get the input schema
            var inputSchema = getNodeOrDefault(currAction, "wot:hasInputSchema", {}, warningCallback);
            
            // check which params this action accepts
            var actionPropertyFields = getArrayNodeOrDefault(inputSchema, "wotschema:properties", [], warningCallback);
            for (var currActionPropertyFieldIndex = 0; currActionPropertyFieldIndex < actionPropertyFields.length; currActionPropertyFieldIndex++) {
                var currActionPropertyField = actionPropertyFields[currActionPropertyFieldIndex];

                
                if (expectType(currActionPropertyField, "iot:StatusData")) {
                    switchProperty = getNodeOrDefault(currActionPropertyField, "wotschema:propertyName", "", warningCallback);
                    break;
                }
            }

            if (switchProperty === "") {
                errorCallback("Action seems to match but has no fitting property", currAction);
            }

            var actionForm = getNodeOrDefault(currAction, "wot:hasForm", {}, warningCallback);
            var input = getNodeOrDefault(currAction, "wot:hasInputSchema", {}, warningCallback);
            var props = getArrayNodeOrDefault(input, "wotschema:properties", [], warningCallback);
            var target = getNodeOrDefault(actionForm, "wotmedia:hasTarget", "{}", warningCallback);

            if (props.length !== 1) {
                console.log("Sorting out action " + currAction["wotschema:propertyName"] +" since it doesn't look like a simple turn on/off action");
                continue;
            }

            switchURL = getNodeOrDefault(target, "@id", "", warningCallback);
        }
    }

    return { "id": id, "name": name, "type": "lamp", "stateProperty": stateProperty, "stateURL": asInternalURL(stateURL, "backend"), "switchProperty": switchProperty, "switchURL": asInternalURL(switchURL, "backend")};
}

const isMotionSensor = (model) => {
    if (expectType(model, "iot:MotionControl")) {
        return true;
    }

    return false;
}

const extractMotionSensor = (model, errorCallback, warningCallback, infoCallback) => {
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "purl:title", "UnknownThing", warningCallback);
    var properties = getArrayNodeOrDefault(model, "wot:hasPropertyAffordance", [], warningCallback);

    // search for the relevant property that reflects the on off state
    var stateURL = "";
    var stateProperty = "";
    for (var currPropertyIndex = 0; currPropertyIndex < properties.length; currPropertyIndex++) {
        var currProperty = properties[currPropertyIndex];

        if (expectType(currProperty, "iot:MotionType")) {
            // we need to figure out which name the property has
            var propertyFields = getArrayNodeOrDefault(currProperty, "wotschema:properties", [], warningCallback);
            for (var currFieldIndex = 0; currFieldIndex < propertyFields.length; currFieldIndex++) {
                var currPropertyField = propertyFields[currFieldIndex];

                if (expectType(currPropertyField, "iot:MotionTypeData")) {
                    stateProperty = getNodeOrDefault(currPropertyField, "wotschema:propertyName", "", warningCallback);
                    break;
                }
            }

            if (stateProperty === "") {
                errorCallback("Motion sensor has no property output with type iot:StatusData", currProperty);
            }

            var form = getFormWithType(currProperty, "wot:readProperty", warningCallback);
            var stateTarget = getNodeOrDefault(form, "wotmedia:hasTarget", "{}", warningCallback);
            stateURL = getNodeOrDefault(stateTarget, "@id", "", warningCallback);
            break;
        }
    }

    return { "id": id, "name": name, "type": "motionsensor", "stateProperty":stateProperty, "stateURL": asInternalURL(stateURL, "backend")};
}

const isPositionTrackerSensor = (model) => {
    if (expectType(model, "iot:PositionMonitoring")) {
        return true;
    }

    return false;
}

const extractPositionTracker = (model, errorCallback, warningCallback, infoCallback) => {
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "purl:title", "UnknownThing", warningCallback);
    var properties = getArrayNodeOrDefault(model, "wot:hasPropertyAffordance", [], warningCallback);

    // search for the relevant property that reflects the on off state
    var xURL = "";
    var yURL = "";
    var zURL = "";

    for (var currPropertyIndex = 0; currPropertyIndex < properties.length; currPropertyIndex++) {
        var currProperty = properties[currPropertyIndex];

        if (expectType(currProperty, "iot:PositionX")) {
            var xForm = getFormWithType(currProperty, "wot:readProperty", warningCallback);
            var xTarget = getNodeOrDefault(xForm, "wotmedia:hasTarget", "{}", warningCallback);
            xURL = getNodeOrDefault(xTarget, "@id", "", warningCallback);
        } else if (expectType(currProperty, "iot:PositionY")) {
            var yForm = getFormWithType(currProperty, "wot:readProperty", warningCallback);
            var yTarget = getNodeOrDefault(yForm, "wotmedia:hasTarget", "{}", warningCallback);
            yURL = getNodeOrDefault(yTarget, "@id", "", warningCallback);
        } else if (expectType(currProperty, "iot:PositionZ")) {
            var zForm = getFormWithType(currProperty, "wot:readProperty", warningCallback);
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

const isSwitch = (model) => {
    if (expectType(model, "iot:BinarySwitchControl")) {
        return true;
    }

    return false;
}

const extractSwitch = (model, errorCallback, warningCallback, infoCallback) => {
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "purl:title", "UnknownThing", warningCallback);
    var properties = getArrayNodeOrDefault(model, "wot:hasPropertyAffordance", [], warningCallback);
    var actions = getArrayNodeOrDefault(model, "wot:hasActionAffordance", [], warningCallback);

    // search for the relevant property that reflects the on off state
    var stateURL = "";
    var statePropertyPath = "";
    for (var currPropertyIndex = 0; currPropertyIndex < properties.length; currPropertyIndex++) {
        var currProperty = properties[currPropertyIndex];

        if (expectType(currProperty, "iot:SwitchStatus") && !expectType(currProperty, "iot:Timeseries")) {
            statePropertyPath = getPropertyPath(currProperty, "$", "iot:StatusData", warningCallback);

            if (statePropertyPath === "") {
                errorCallback("Switch has no property output with type iot:StatusData", currProperty);
            }

            var form = getFormWithType(currProperty, "wot:readProperty", warningCallback);
            var stateTarget = getNodeOrDefault(form, "wotmedia:hasTarget", "{}", warningCallback);
            stateURL = getNodeOrDefault(stateTarget, "@id", "", warningCallback);
            
            break;
        }
    }

    var switchOnURL = "";
    var switchOffURL = "";

    for (var currOnActionIndex = 0; currOnActionIndex < actions.length; currOnActionIndex++) {
        var currOnAction = actions[currOnActionIndex];

        if (expectType(currOnAction, "iot:TurnOn")) {
            var actionOnForm = getNodeOrDefault(currOnAction, "wot:hasForm", {}, warningCallback);
            var targetOn = getNodeOrDefault(actionOnForm, "wotmedia:hasTarget", "{}", warningCallback);

            switchOnURL = getNodeOrDefault(targetOn, "@id", "", warningCallback);
        }
    }

    for (var currOffActionIndex = 0; currOffActionIndex < actions.length; currOffActionIndex++) {
        var currOffAction = actions[currOffActionIndex];

        if (expectType(currOffAction, "iot:TurnOff")) {
            var actionOffForm = getNodeOrDefault(currOffAction, "wot:hasForm", {}, warningCallback);
            var targetOff = getNodeOrDefault(actionOffForm, "wotmedia:hasTarget", "{}", warningCallback);

            switchOffURL = getNodeOrDefault(targetOff, "@id", "", warningCallback);
        }
    }

    return { "id": id, "name": name, "type": "switch", "statePropertyPath": statePropertyPath, "stateURL": asInternalURL(stateURL, "backend"), "switchOnURL": asInternalURL(switchOnURL, "backend"), "switchOffURL": asInternalURL(switchOffURL, "backend")};
}

// searches for a form with specific type otherfwise returns empty object
export const getFormWithType = (node, expectedType, warningCallback) => {
    var forms = getArrayNodeOrDefault(node, "wot:hasForm", [], warningCallback);
    for (var currFormIndex = 0; currFormIndex < forms.length; currFormIndex++) {
        var currForm = forms[currFormIndex];
        var currFormOperationType = getNodeOrDefault(currForm, "wotmedia:hasOperationType", {}, warningCallback);
        var currFormOperationTypeID = getNodeOrDefault(currFormOperationType, "@id", "FormIDMissing", warningCallback);
        if (currFormOperationTypeID === expectedType) {
            return currForm;
        }
    }

    return {}
}

// given a properties node this will search for the node have a given type and returns its json path
export const getPropertyPath = (node, currPath, expectedSchemaType, warningCallback) => {
    var noop = function() {};

    var isArray = false;
    var props = getArrayNodeOrDefault(node, "wotschema:properties", [], noop);
    if (props.length === 0) {
        isArray = true;
        props = getArrayNodeOrDefault(node, "wotschema:items", [], noop);
    }

    for (var currPropsIndex = 0; currPropsIndex < props.length; currPropsIndex++) {
        var currProp = props[0];

        var updatedPath = currPath;
        if (updatedPath === "") {
            updatedPath = "$"
        }

        if (!isArray) {
            updatedPath += "['"+getNodeOrDefault(currProp, "wotschema:propertyName", "UNKNOWN", noop)+"']";
        } else {
            updatedPath += "["+currPropsIndex+"]";
        }

        if (expectType(currProp, expectedSchemaType)) {
            return updatedPath;
        }

        var childPath = getPropertyPath(currProp, updatedPath, expectedSchemaType, noop);
        if (childPath !== "") {
            return childPath;
        }
    }

    return "";
}