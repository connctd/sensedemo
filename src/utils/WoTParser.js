import * as jsonld from 'jsonld';
import { asInternalURL } from './Common.js';
import { wotContext } from './Common.js';

export const retrieveAndParseWoTModel = async (wotURL, errorCallback, warningCallback, infoCallback) => {
    var url = asInternalURL(wotURL, "backend");
    var resp = await fetch(url);
    var jsonResp = await resp.json();

    if (resp.status !== 200) {
        console.error(resp);
        errorCallback("Failed to resolve WoT TD", wotURL);
        return;
    }

    console.log("Resolved wot has context");
    console.log(jsonResp["@context"][0]);

    return parseModel(jsonResp, errorCallback, warningCallback, infoCallback);
}

export const parseModel = async (model, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Parsing WoT TD model", model);
    var compactedModel = await getReducedModel(model, errorCallback, warningCallback, infoCallback);

    if (compactedModel !== undefined) {
        
    }
};

// expands and compacts given model
const getReducedModel = async (model, errorCallback, warningCallback, infoCallback) => {
    if (model === undefined || model["@context"] === undefined) {
        errorCallback("Model has no context", model);
        return;
    }

    // let all context uris point to special endpoint
    console.log("Resolved wot has context");

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
