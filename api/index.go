package api

import (
	"encoding/base64"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
)

// HandleIndexCall does nothing
func HandleIndexCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Index call!")
	w.WriteHeader(200)
}

// given a url that contains a base64 encode url this will extract it
func extractRequestedURL(requestedURL string) (string, error) {
	if requestedURL == "" {
		return "", errors.New("No data query element was passed")
	}

	escapedURL, err := url.PathUnescape(requestedURL)

	if err != nil {
		return "", errors.New("Failed to unescape model url")
	}

	decodedURL, err := base64.StdEncoding.DecodeString(escapedURL)
	if err != nil {
		fmt.Println(err)
		return "", errors.New("Failed to decode model url: " + escapedURL)
	}

	return string(decodedURL), nil
}

// forwards request r to given url; you can append additional headers
func forwardRequest(url string, w http.ResponseWriter, r *http.Request, forwardHeaders map[string]string) {
	proxyReq, err := http.NewRequest(r.Method, url, r.Body)
	if err != nil {
		fmt.Println("Failed to create forward request", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// copy headers to subfollowing request
	for header, values := range r.Header {
		for _, value := range values {
			proxyReq.Header.Add(header, value)
		}
	}

	// add additional forwardHeaders to request
	for header, value := range forwardHeaders {
		proxyReq.Header.Add(header, value)
	}

	// subrequest
	//client := &http.Client{}
	client := http.DefaultClient
	resp, err := client.Do(proxyReq)
	if err != nil {
		fmt.Println("Failed to create proxy request", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to read proxy response", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// copy proxy response headers to response
	for header, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(header, value)
		}
	}

	if strings.HasPrefix(url, "https://schema.org") {
		w.Header().Add("Access-Control-Allow-Headers", "content-type")
		w.Header().Set("Access-Control-Allow-Origin", "*")
	}

	w.WriteHeader(resp.StatusCode)
	w.Write(bodyBytes)
}
