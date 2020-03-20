import * as jsonld from 'jsonld';
import { asInternalURL } from './Common.js';
import { wotContext } from './Common.js';
import { extractThing } from './WoTConverter.js';

export const retrieveAndParseWoTModel = async (wotURL, errorCallback, warningCallback, infoCallback) => {
    var url = asInternalURL(wotURL, "backend");
    var resp;
    try {
        resp = await fetch(url);
    } catch(e) {
        errorCallback("Failed to resolve WOT TD", wotURL);
        return;
    }
    
    if (resp.status !== 200) {
        console.error(resp);
        errorCallback("Failed to resolve WoT TD. Invalid status code", wotURL);
        return;
    }

    var jsonResp
    try {
        jsonResp = await resp.json();
    } catch (e) {
        errorCallback("Failed to parse WOT TD", wotURL);
        return;
    }    

    return parseModel(jsonResp, errorCallback, warningCallback, infoCallback);
}

export const parseModel = async (model, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Parsing WoT TD model", model);
    var compactedModel = await getReducedModel(model, errorCallback, warningCallback, infoCallback);

    if (compactedModel !== undefined) {
        var thing = extractThing(compactedModel, errorCallback, warningCallback, infoCallback);
        if (thing !== undefined) {
            infoCallback("Thing was extracted", thing);
            return thing;
        }
    }
};

// expands and compacts given model
const getReducedModel = async (model, errorCallback, warningCallback, infoCallback) => {
    if (model === undefined || model["@context"] === undefined) {
        errorCallback("Model has no context", model);
        return;
    }

    infoCallback("Applied context modifications", model);

    try {
        let expanded = await jsonld.expand(model);
        infoCallback("Model was expanded", expanded);

        let compacted = await jsonld.compact(expanded, wotContext);
        infoCallback("Model was compacted", compacted);

        return compacted;
    } catch (err) {
        console.error(err);
        errorCallback("Failed to convert model", err);
    }
}
