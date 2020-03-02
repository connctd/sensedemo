package handler

import (
	"fmt"
	"net/http"
)

// HandleIndexCall does nothing
func HandleIndexCall(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Index call!")
	w.WriteHeader(200)
}
