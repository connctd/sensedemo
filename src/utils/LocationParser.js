import * as jsonld from 'jsonld';
import { extractSiteData } from './Converter.js';
import { loadDocument } from './Common.js';
import { locationsContext } from './Common.js';

// loads remote model and transforms it to a representation this visualizer can work with
export const parseModel = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    infoCallback("Parsing model", model);

    var compactedModel = await getReducedModel(model, successCallback, errorCallback, warningCallback, infoCallback);

    if (compactedModel !== undefined) {
        var extractedModel = extractSiteData(compactedModel, successCallback, errorCallback, warningCallback, infoCallback);
        
        if (extractedModel !== undefined) {
            successCallback("Finished", extractedModel);
        }
    }
};

// expands and compacts given model
const getReducedModel = async (model, successCallback, errorCallback, warningCallback, infoCallback) => {
    if (model === undefined || model["@context"] === undefined) {
        errorCallback("Model has no context", model);
        return;
    }

    // change the default document loader
    const customLoader = async (url, options) => {
        console.log(url);
        if (url === "https://w3id.org/bot#") {
            console.log("Separately resolving bot context");
            return {
                contextUrl: null,
                document: await loadDocument("http://localhost:8080/api/schema?data=aHR0cHM6Ly93M2lkLm9yZy9ib3Qj#", {
                    'Accept': 'application/ld+json'
                }),
                documentUrl: "http://localhost:8080/api/schema?data=aHR0cHM6Ly93M2lkLm9yZy9ib3Qj#"
            };
        }
    
        return {
            contextUrl: null,
            document: await loadDocument(url, {
                'Accept': 'application/ld+json'
            }),
            documentUrl: url
        };
    };
    
    jsonld.documentLoader = customLoader;

    // let all context uris point to special endpoint
    //model["@context"] = localizeUrls(model["@context"], errorCallback, warningCallback, infoCallback);

    infoCallback("Applied context modifications", model);

    try {
        let expanded = await jsonld.expand(model);
        infoCallback("Model was expanded", expanded);

        let compacted = await jsonld.compact(expanded, locationsContext, { graph: false, compactArrays: true, framing: false});
        infoCallback("Model was compacted", compacted);

        return compacted;
    } catch (err) {
        errorCallback("Failed to convert model", err);
    }
}
