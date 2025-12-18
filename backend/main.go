package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// album represents data about a record album.
type album struct {
    ID     string  `json:"id"`
    Title  string  `json:"title"`
    Artist string  `json:"artist"`
    Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
    {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
}

func getFlowContext() gin.H {
    return gin.H{
        "nodes": []gin.H{},
        "edges": []gin.H{},
    }
}

func postRunFlow(c *gin.Context) {
    var flowData gin.H
    if err := c.BindJSON(&flowData); err != nil {
        c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    fmt.Println("Received flow data:")
    fmt.Printf("%+v\n", flowData)
    c.IndentedJSON(http.StatusOK, gin.H{"message": "Flow data received"})
}

func main() {
    router := gin.Default()
    router.GET("/albums", getAlbums)
    router.POST("/run-flow", postRunFlow)

    router.Run("localhost:8080")
}
