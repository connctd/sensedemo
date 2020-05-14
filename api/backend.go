package handler

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"os"
	"strings"
)

const (
	connctdPrefix = "https://api.connctd.io"
	fhdoPrefix    = "https://iktsystems.goip.de:443"
)

// HandleBackendCall intercepts backend calls, addes headers and forwards
func HandleBackendCall(w http.ResponseWriter, r *http.Request) {
	// ignore cert errors
	http.DefaultTransport.(*http.Transport).TLSClientConfig = &tls.Config{InsecureSkipVerify: true}

	requestedURL := r.URL.Query().Get("data")
	url, err := extractRequestedURL(requestedURL)
	if err != nil {
		fmt.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	additionalHeaders := map[string]string{}
	if strings.HasPrefix(url, connctdPrefix) {
		token := os.Getenv("SENSE_CONNCTD_TOKEN")
		additionalHeaders["Authorization"] = "Bearer " + token
		additionalHeaders["X-External-Subject-ID"] = "default"
	} else if strings.HasPrefix(url, fhdoPrefix) {
		token := os.Getenv("SENSE_FH_TOKEN")
		apiKey := os.Getenv("SENSE_FH_KEY")

		additionalHeaders["Authorization"] = "Bearer " + token
		additionalHeaders["x-api-key"] = apiKey
		additionalHeaders["X-Host-Override"] = "wot-device-api"
		r.Header.Del("Origin")
	}

	forwardRequest(url, w, r, additionalHeaders)
}
