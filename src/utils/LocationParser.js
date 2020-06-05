import * as jsonld from 'jsonld';
import { extractSiteData } from './LocationConverter.js';
import { loadDocument, asInternalURL } from './Common.js';
import { locationsContext } from './Common.js';

// loads remote model and transforms it to a representation this visualizer can work with
export const parseModel = async (model, successCallback, errorCallback, warningCallback, infoCallback, notificationCallback) => {
    infoCallback("Parsing model", model);
    notificationCallback("Step 1/4: Read raw input model", model)

    var compactedModel = await getReducedModel(model, successCallback, errorCallback, warningCallback, infoCallback, notificationCallback);

    notificationCallback("Step 2/4: Preprocess model (expand & compact)", compactedModel)

    if (compactedModel !== undefined) {
        notificationCallback("Step 3/4: Traverse model, resolve tds and translate", compactedModel)
        var extractedModel = await extractSiteData(compactedModel, successCallback, errorCallback, warningCallback, infoCallback, notificationCallback);
        
        if (extractedModel !== undefined) {
            successCallback("Finished", extractedModel);
            notificationCallback("Step 4/4: Pass translated model to rule engine and renderer", extractedModel)
        }
    }
};

// expands and compacts given model
const getReducedModel = async (model, successCallback, errorCallback, warningCallback, infoCallback, notificationCallback) => {
    if (model === undefined || model["@context"] === undefined) {
        errorCallback("Model has no context", model);
        return;
    }

    // change the default document loader
    const customLoader = async (url, options) => {
        if (url === "https://w3id.org/bot#") {
            console.log("Separately resolving bot context");
            return {
                contextUrl: null,
                document: await loadDocument(asInternalURL("https://w3id.org/bot#", "schema"), {
                    'Accept': 'application/ld+json'
                }),
                documentUrl: asInternalURL("https://w3id.org/bot#", "schema")
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
