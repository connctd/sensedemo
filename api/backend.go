package handler

import (
	"fmt"
	"net/http"
	"os"
	"strings"
)

const (
	connctdPrefix = "https://api.connctd.io"
	fhdoPrefix    = "https://iktsystems.goip.de:443/ict-gw/v1/things"
)

// HandleBackendCall intercepts backend calls, addes headers and forwards
func HandleBackendCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Backend Call! ")

	requestedURL := r.URL.Query().Get("data")
	url, err := extractRequestedURL(requestedURL)
	if err != nil {
		fmt.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Println("Forward to " + url)

	additionalHeaders := map[string]string{}
	if strings.HasPrefix(url, connctdPrefix) {
		token := os.Getenv("SENSE_CONNCTD_TOKEN")
		additionalHeaders["Authorization"] = "Bearer " + token
		additionalHeaders["X-External-Subject-ID"] = "default"
	} else if strings.HasPrefix(url, fhdoPrefix) {
		w.Header().Add("Content-Type", "application/json")
		w.Write(mockResponse())
	}

	forwardRequest(url, w, r, additionalHeaders)
}

func mockResponse() []byte {
	obj := `{
		"@context": [
			"https://www.w3.org/2019/wot/td#",
			{
				"http": "http://iotschema.org/protocol/http"
			},
			{
				"iot": "http://iotschema.org/"
			},
			{
				"schema": "https://schema.org/"
			},
			{
				"saref": "https://w3id.org/saref#"
			}
		],
		"id": "https://iktsystems.goip.de:443/ict-gw/v1/things/59b65e47738a439d",
		"title": "Lamp",
		"security": [
			"bearer_sc"
		],
		"@type": [
			"http://iotschema.org/Actuator",
			"http://iotschema.org/BinarySwitchControl",
			"https://w3id.org/saref#LightingDevice"
		],
		"description": "Lamp",
		"version": {
			"instance": "0.1"
		},
		"created": "2020-02-10T14:50:46.186Z",
		"modified": "2020-02-10T14:50:46.186Z",
		"support": "https://www.fh-dortmund.de/de/fb/10/ikt/index.php",
		"base": "https://iktsystems.goip.de:443",
		"properties": {
			"onOff": {
				"properties": {
					"onOff": {
						"schema:dateModified": {
							"@id": "urn:uuid:9a45a888-c803-4714-9bc3-266200a4d3b2/dateModified"
						},
						"instanceOf": "org.ict.model.wot.dataschema.BooleanSchema",
						"title": "onOff",
						"description": "The state to be set (true/false)",
						"type": "boolean",
						"readOnly": true,
						"writeOnly": false
					},
					"time": {
						"@id": "urn:uuid:9a45a888-c803-4714-9bc3-266200a4d3b2/dateModified",
						"instanceOf": "org.ict.model.wot.dataschema.StringSchema",
						"@type": [
							"https://schema.org/DateTime"
						],
						"title": "Date time",
						"description": "The date time in ISO 8601 format",
						"type": "string",
						"readOnly": true,
						"writeOnly": false
					}
				},
				"forms": [
					{
						"op": [
							"readproperty"
						],
						"href": "https://iktsystems.goip.de:443/ict-gw/v1/things/59b65e47738a439d/actions/63102bb108bf45ed/onOff",
						"contentType": "application/json",
						"subprotocol": "https"
					}
				],
				"instanceOf": "org.ict.model.wot.dataschema.ObjectSchema",
				"@type": [
					"http://iotschema.org/SwitchStatus"
				],
				"title": "onOff",
				"type": "object",
				"readOnly": true,
				"writeOnly": false
			}
		},
		"actions": {
			"onOff": {
				"input": {
					"properties": {
						"onOff": {
							"instanceOf": "org.ict.model.wot.dataschema.BooleanSchema",
							"title": "onOff",
							"description": "The state to be set (true/false)",
							"type": "boolean",
							"readOnly": false,
							"writeOnly": false
						}
					},
					"instanceOf": "org.ict.model.wot.dataschema.ObjectSchema",
					"title": "onOff",
					"type": "object",
					"readOnly": false,
					"writeOnly": true
				},
				"safe": false,
				"idempotent": false,
				"forms": [
					{
						"op": [
							"invokeaction"
						],
						"href": "https://iktsystems.goip.de:443/ict-gw/v1/things/59b65e47738a439d/actions/63102bb108bf45ed/onOff",
						"contentType": "application/json",
						"subprotocol": "https"
					}
				],
				"@type": [
					"http://iotschema.org/TurnOn",
					"http://iotschema.org/TurnOff"
				],
				"title": "onOff"
			}
		},
		"securityDefinitions": {
			"bearer_sc": {
				"scheme": "bearer",
				"instanceOf": "org.ict.model.wot.security.BearerSecurityScheme",
				"in": "header",
				"name": "bearer_sc",
				"alg": "ES256",
				"format": "jwt",
				"authorization": "https://iktsystems.goip.de:443/ict-gw/v1"
			}
		},
		"hardware": {
			"href": {
				"op": [
					"readproperty"
				],
				"href": "https://iktsystems.goip.de:443/ict-gw/v1/hardware/hardware:494c45f9d4dd4ff6",
				"contentType": "application/json",
				"subprotocol": "https"
			}
		}
	}`

	return []byte(obj)
}
