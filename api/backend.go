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
	fhdoPrefix    = "https://iktsystems.goip.de:443/ict-gw/v1/things"
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

		token := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJPcUNxZXY2Mm5TS0h3elFXRVFQbGVmSjZnWFJXRER1SyJ9.bg7raXFFtGvY4CKAmd72zcaOsrcdt8t5HQTitC4Ktfc"
		apiKey := "UyfRm1CFNJLXMCG30R2ia1J821x5DlPt"

		additionalHeaders["Authorization"] = "Bearer " + token
		additionalHeaders["x-api-key"] = apiKey
		additionalHeaders["X-Host-Override"] = "wot-device-api"
		r.Header.Del("Origin")
	}

	forwardRequest(url, w, r, additionalHeaders)
}
