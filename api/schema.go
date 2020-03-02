package handler

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

var (
	BotModelURLOne = "https://w3id.org/bot#"
	BotModelURLTwo = "https://w3c-lbd-cg.github.io/bot/#"
)

// HandleSchemaCall will intercept any schema call
func HandleSchemaCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Schema call" + r.Method)

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	fragments := strings.Split(r.RequestURI, "/")
	requestedModel := fragments[len(fragments)-1]
	escapedModelURL, err := url.PathUnescape(requestedModel)

	if err != nil {
		fmt.Println("Failed to unescape model url", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	decodedModelURL, err := base64.StdEncoding.DecodeString(escapedModelURL)
	if err != nil {
		fmt.Println("Failed to decode model url", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	modelURL := string(decodedModelURL)
	fmt.Println(modelURL)

	if modelURL == BotModelURLOne || modelURL == BotModelURLTwo {
		fmt.Println("Sending bot model")

		w.WriteHeader(200)

		modelBytes, err := getBotModel()
		if err != nil {
			fmt.Println("Failed to encode bot model", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if _, err := w.Write(modelBytes); err != nil {
			fmt.Println("Failed to send reply", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
}

func getBotModel() (json.RawMessage, error) {
	var model map[string]interface{}
	err := json.Unmarshal([]byte(botModel), &model)

	if err != nil {
		return []byte{}, err
	}

	return json.Marshal(model)
}
