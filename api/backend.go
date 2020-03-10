package handler

import (
	"fmt"
	"net/http"
	"os"
	"strings"
)

const (
	connctdPrefix = "https://api.connctd.io"
)

// HandleBackendCall intercepts backend calls, addes headers and forwards
func HandleBackendCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Backend Call!")

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
	}

	forwardRequest(url, w, r, additionalHeaders)
}
