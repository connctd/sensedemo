package handler

import (
	"fmt"
	"net/http"
)

// HandleBackendCall intercepts backend calls, addes headers and forwards
func HandleBackendCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("BackendCall!")
	w.WriteHeader(200)
}
