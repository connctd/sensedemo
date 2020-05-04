package main

import (
	"fmt"
	"net/http"

	handler "github.com/connctd/sensedemo/api"
)

// this application is just for local testing
func main() {
	http.HandleFunc("/api/backend", handler.HandleBackendCall)
	http.HandleFunc("/api/schema", handler.HandleSchemaCall)
	http.HandleFunc("/api/redirect", handler.HandleRedirectCall)
	fmt.Println("Waiting...")
	http.ListenAndServe(":8080", nil)

}
