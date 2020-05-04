import { retrieveAndParseWoTModel } from './WoTParser.js';
import { getNodeOrDefault, expectType, getArrayNodeOrDefault } from './Common.js';

// parses a model and extracts all site->building->storey data
export const extractSiteData = async (model, successCallback, errorCallback, warningCallback, infoCallback, notificationCallback) => {
    infoCallback("Extracting site from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Site")) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "schema:name", "UnknownSite", warningCallback);
    var buildings = getArrayNodeOrDefault(model, "bot:hasBuilding", [], warningCallback);
    
    var convertedBuildings = [];
    for (var i = 0; i < buildings.length; i++) {
        var convertedBuilding = await extractBuildingData(buildings[i], successCallback, errorCallback, warningCallback, infoCallback, notificationCallback);
        convertedBuildings.push(convertedBuilding);
    }

    return [{ id: id, name: name, area: dimensions, buildings: convertedBuildings }];
}

const extractBuildingData = async (model, successCallback, errorCallback, warningCallback, infoCallback, notificationCallback) => {
    infoCallback("Extracting building from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Building")) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "schema:name", "UnknownBuilding", warningCallback);
    var storeys = getArrayNodeOrDefault(model, "bot:hasStorey", [], warningCallback);

    var convertedStoreys = [];
    for (var i = 0; i < storeys.length; i++) {
        var convertedStorey = await extractStoryData(storeys[i], successCallback, errorCallback, warningCallback, infoCallback);
        convertedStoreys.push(convertedStorey);
    }

    return { id: id, name: name, area: dimensions, storeys: convertedStoreys };
}

const extractStoryData = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting storey from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Storey")) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "schema:name", "UnknownStorey", warningCallback);
    var floor = getNodeOrDefault(model, "schema:floorLevel", "0", warningCallback);
    var spaces = getArrayNodeOrDefault(model, "bot:hasSpace", [], warningCallback);

    var convertedSpaces = [];
    for (var i = 0; i < spaces.length; i++) {
        var convertedSpace = await extractSpaceData(spaces[i], successCallback, errorCallback, warningCallback, infoCallback);
        convertedSpaces.push(convertedSpace);
    }

    return { id: id, name: name, level: floor, area: dimensions, rooms: convertedSpaces };
}

const extractSpaceData = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting space from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "bot:Space")) {
        errorCallback("Node has invalid type", model);
        return;
    }

    var dimensions = extractDimensions(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "UnknownID", warningCallback);
    var name = getNodeOrDefault(model, "schema:name", "UnknownSpace", warningCallback);
    var elements = getArrayNodeOrDefault(model, "bot:hasElement", [], warningCallback);

    var convertedElements = [];
    for (var i = 0; i < elements.length; i++) {
        var convertedElement = await extractElementData(elements[i], successCallback, errorCallback, warningCallback, infoCallback);
        if (convertedElement !== undefined) {
            convertedElements.push(convertedElement);
        }
    }

    return { id: id, name: name, area: dimensions, things: convertedElements };
}

const extractElementData = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Extracting element from model", model);

    // we are expecting a site as root element
    if (!expectType(model, "wot:Thing")) {
        warningCallback("Node is no wot:Thing. Skipping", model);
        return;
    }

    var position = extractPosition(model, errorCallback);
    var id = getNodeOrDefault(model, "@id", "", warningCallback);

    var thing = await retrieveAndParseWoTModel(id, errorCallback, warningCallback, infoCallback);

    if (thing === undefined) {
        warningCallback("Ignoring wot:Thing", model);
        return;
    }

    return { id: id, position: position, details: thing };
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

    if (coordinates.length % 2 !== 0) {
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

    if (coordinates.length !== 2) {
        errorCallback("Malformed position coordinates", model);
        return {};
    }

    return { x: coordinates[0], y: coordinates[1] };
}
