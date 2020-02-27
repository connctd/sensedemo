package handler

import (
	"net/http"
)

// Handler automatically handled by now.sh infrastructure
func Handler(w http.ResponseWriter, r *http.Request) {

	w.Write([]byte("Hello world"))

}
