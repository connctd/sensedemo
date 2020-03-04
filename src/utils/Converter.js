// parses a model and extracts all site->building->storey data
export const extractSiteData = (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting site from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Site", errorCallback)) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "http://schema.org/name", "UnknownSite", warningCallback);
    var buildings = getArrayNodeOrDefault(model, "bot:hasBuilding", [], warningCallback);

    var convertedBuildings = [];
    for (var i = 0; i < buildings.length; i++) {
        var convertedBuilding = extractBuildingData(buildings[i], successCallback, errorCallback, warningCallback, infoCallback);
        convertedBuildings.push(convertedBuilding);
    }

    return [{ id: id, name: name, area: dimensions, buildings: convertedBuildings }];
}

const extractBuildingData = (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting building from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Building", errorCallback)) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "http://schema.org/name", "UnknownBuilding", warningCallback);
    var storeys = getArrayNodeOrDefault(model, "bot:hasStorey", [], warningCallback);

    var convertedStoreys = [];
    for (var i = 0; i < storeys.length; i++) {
        var convertedStorey = extractStoryData(storeys[i], successCallback, errorCallback, warningCallback, infoCallback);
        convertedStoreys.push(convertedStorey);
    }

    return { id: id, name: name, area: dimensions, storeys: convertedStoreys };
}

const extractStoryData = (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting storey from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Storey", errorCallback)) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "http://schema.org/name", "UnknownStorey", warningCallback);
    var floor = getNodeOrDefault(model, "http://schema.org/floorLevel", "0", warningCallback);
    var spaces = getArrayNodeOrDefault(model, "bot:hasSpace", [], warningCallback);

    var convertedSpaces = [];
    for (var i = 0; i < spaces.length; i++) {
        var convertedSpace = extractSpaceData(spaces[i], successCallback, errorCallback, warningCallback, infoCallback);
        convertedSpaces.push(convertedSpace);
    }

    return { id: id, name: name, level: floor, area: dimensions, rooms: convertedSpaces };
}

const extractSpaceData = (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting space from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Space", errorCallback)) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "http://schema.org/name", "UnknownSpace", warningCallback);
    var elements = getArrayNodeOrDefault(model, "bot:hasElement", [], warningCallback);

    var convertedElements = [];
    for (var i = 0; i < elements.length; i++) {
        var convertedElement = extractElementData(elements[i], successCallback, errorCallback, warningCallback, infoCallback);
        convertedElements.push(convertedElement);
    }

    return { id: id, name: name, area: dimensions, things: convertedElements };
}

const extractElementData = (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting element from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "wot:Thing", errorCallback)) {
        warningCallback("Node is no wot:Thing. Skipping", model);
        return;
    }

    var position = extractPosition(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "", warningCallback);

    warningCallback("Now I have to resolve that...", id);
    
    return { id: id, position: position };
}

// resolves model[field] or returns default if not found
const getNodeOrDefault = (model, field, defaultValue, warningCallback) => {
    var fieldValue = model[field];
    if (fieldValue === undefined) {
        warningCallback("Node has no field " + field, model);
        return defaultValue;
    }

    return fieldValue;
}

const getArrayNodeOrDefault = (model, field, defaultValue, warningCallback) => {
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

// searches for geo coordinates and builds up an array of points
const extractDimensions = (model, errorCallback) => {
    var geometry = model["geo:geometry"];
    if (geometry === undefined) {
        errorCallback("Geometry not found", model);
        return [];
    }

    if (!expectType(geometry, "geo:Polygon")) {
        errorCallback("Expected polygon type", geometry);
        return [];
    }

    var coordinates = geometry["geo:coordinates"];
    if (coordinates === undefined || !Array.isArray(coordinates)) {
        errorCallback("Coordinates undefined or not an array", geometry);
        return [];
    }

    if (coordinates.length % 2 != 0) {
        errorCallback("Malformed coordinates", model);
        return [];
    }

    var result = [];
    for (var i = 0; i < coordinates.length; i += 2) {
        result.push({ x: coordinates[i], y: coordinates[i + 1] });
    }

    return result;
}

// searches for a geo position
const extractPosition = (model, errorCallback) => {
    var geometry = model["geo:geometry"];
    if (geometry === undefined) {
        errorCallback("Geometry not found", model);
        return {};
    }

    if (!expectType(geometry, "geo:Point")) {
        errorCallback("Expected point type", geometry);
        return {};
    }

    var coordinates = geometry["geo:coordinates"];
    if (coordinates === undefined || !Array.isArray(coordinates)) {
        errorCallback("Coordinates undefined or not an array", geometry);
        return {};
    }

    if (coordinates.length != 2) {
        errorCallback("Malformed position coordinates", model);
        return {};
    }

    return { x: coordinates[0], y: coordinates[1] };
}

// checks if @type is or contains expected type
const expectType = (model, expectedType) => {
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

// takes an internal address and base64 decodes the location part
const asExternalURL = (input) => {
    var arr = input.split("/api/schema/");
    var urlDecoded = decodeURIComponent(arr[1]);
    var decoded = Buffer.from(urlDecoded, 'base64').toString('ascii');
    return decoded;
}