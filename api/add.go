package api

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

type addTdPayload struct {
	TD string  `json:"td"`
	X  float32 `json:"x"`
	Y  float32 `json:"y"`
}

// HandleAddCall intercepts an add call since adding tds differs
func HandleAddCall(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "content-type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
	} else if r.Method == http.MethodPost {
		// ignore cert errors
		http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

		requestedURL := r.URL.Query().Get("data")
		url, err := extractRequestedURL(requestedURL)
		if err != nil {
			fmt.Println("Failed extract request url when adding td: " + err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			fmt.Println("Failed to read body for adding td: " + err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		var tdToAdd addTdPayload
		err = json.Unmarshal(body, &tdToAdd)
		if err != nil {
			fmt.Println("Failed to unmarshal add td query: " + err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if strings.HasPrefix(url, connctdPrefix) {
			err := addViaConnctdTD(url, tdToAdd)
			if err != nil {
				fmt.Println("Failed to add td: " + err.Error())
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		} else if strings.HasPrefix(url, fhdoPrefix) {
			err := addViaFHDoTD(url, tdToAdd)
			if err != nil {
				fmt.Println("Failed to add td: " + err.Error())
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func addViaConnctdTD(targetLocation string, tdToAdd addTdPayload) error {
	token := os.Getenv("SENSE_CONNCTD_TOKEN")
	headers := map[string]string{
		"Authorization":         "Bearer " + token,
		"X-External-Subject-ID": "default",
	}

	geometry := geometry{Types: []string{"geo:Point"}, Coordinates: []float32{tdToAdd.X, tdToAdd.Y}}
	payload := location{Context: defaultContext, Types: defaultTypes, ID: tdToAdd.TD, Geometry: geometry}
	var resp locationAddResp

	err := doRequest(context.Background(),
		http.DefaultClient,
		http.MethodPost,
		"https://api.connctd.io/api/betav1/wot/locations",
		http.StatusCreated,
		payload,
		&resp, headers)

	if err != nil {
		fmt.Println("Failed to add td location: " + err.Error())
		return err
	}

	fmt.Println("Added location " + resp.ID)

	relation := locationRelation{ID: resp.ID, Type: "bot:Element"}
	err = doRequest(context.Background(),
		http.DefaultClient,
		http.MethodPost,
		targetLocation+"/relations",
		http.StatusNoContent,
		relation,
		nil, headers)

	if err != nil {
		fmt.Println("Failed to add td relation via connctd: " + err.Error())
		return err
	}

	return nil
}

func addViaFHDoTD(targetLocation string, tdToAdd addTdPayload) error {
	token := os.Getenv("SENSE_FH_TOKEN")
	apiKey := os.Getenv("SENSE_FH_KEY")

	headers := map[string]string{
		"Authorization":   "Bearer " + token,
		"x-api-key":       apiKey,
		"X-Host-Override": "wot-device-api",
	}

	geometry := geometry{
		Types: []string{"geo:Point"},
		Coordinates: []float32{tdToAdd.X, tdToAdd.Y},
		Type: "org.ict.model.bot.jsongeo.Point"}
	payload := location{
		Context: defaultContext,
		Types: defaultTypes,
		ID: tdToAdd.TD,
		Geometry: geometry,
	}

	err := doRequest(context.Background(),
		http.DefaultClient,
		http.MethodPost,
		targetLocation,
		http.StatusOK,
		payload,
		nil, headers)

	if err != nil {
		fmt.Println("Failed to add td relation via fh do: " + err.Error())
		return err
	}

	return nil
}

func doRequest(
	ctx context.Context,
	client *http.Client,
	method string,
	url string,
	expectedStatusCode int,
	payload interface{},
	responseBody interface{},
	headers map[string]string) error {

	var payloadBytes []byte
	var err error

	// marshal payload if given
	if payload != nil {
		payloadBytes, err = json.Marshal(payload)
		if err != nil {
			return err
		}
	}

	req, err := http.NewRequest(method, url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}

	// set content type
	if payload != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	// append headers
	for key, val := range headers {
		req.Header.Set(key, val)
	}

	resp, err := client.Do(req.WithContext(ctx))
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	// status code does not match with existing one
	if resp.StatusCode != expectedStatusCode {
		return errors.New("Invalid status code " + resp.Status)
	}

	if responseBody != nil {
		if err := json.NewDecoder(resp.Body).Decode(responseBody); err != nil {
			return err
		}
	}

	return nil
}

type location struct {
	Context  map[string]string `json:"@context"`
	Types    []string          `json:"@type"`
	ID       string            `json:"@id"`
	Geometry geometry          `json:"geo:geometry"`
}

type geometry struct {
	Types       []string  `json:"@type"`
	Coordinates []float32 `json:"geo:coordinates"`
	Type string `json:"type,omitempty"`
}

var defaultContext = map[string]string{
	"bot": "https://w3id.org/bot#",
	"wot": "https://www.w3.org/2019/wot/td#",
	"geo": "https://purl.org/geojson/vocab#",
}

var defaultTypes = []string{"bot:Element", "wot:Thing"}

type locationAddResp struct {
	ID string `json:"id"`
}

type locationRelation struct {
	ID   string `json:"id"`
	Type string `json:"type"`
}
