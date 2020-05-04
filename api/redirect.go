package handler

import (
	"fmt"
	"net/http"
)

// HandleRedirectCall just does a redirect to an appended url (data)
func HandleRedirectCall(w http.ResponseWriter, r *http.Request) {
	requestedURL := r.URL.Query().Get("data")

	url, err := extractRequestedURL(requestedURL)
	if err != nil {
		fmt.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}
