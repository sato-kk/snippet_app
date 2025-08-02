package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Snippet represents a code snippet
type Snippet struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Code        string `json:"code"`
	Description string `json:"description"`
}

var snippets []Snippet
var nextID = 1 // Simple ID generator

func main() {
	r := gin.Default()

	// Initialize some dummy data
	snippets = []Snippet{
		{ID: nextID, Title: "Hello World (Go)", Code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, World!\")\n}", Description: "A simple Go program."},
		{ID: nextID + 1, Title: "React Component Example", Code: "function MyComponent() {\n  return <div>Hello from React!</div>;\n}", Description: "A basic React functional component."},
	}
	nextID = len(snippets) + 1

	// API Endpoints
	// GET /snippets - Get all snippets
	r.GET("/snippets", getSnippets)
	// GET /snippets/:id - Get a specific snippet by ID
	r.GET("/snippets/:id", getSnippetByID)
	// POST /snippets - Create a new snippet
	r.POST("/snippets", createSnippet)
	// PUT /snippets/:id - Update an existing snippet
	r.PUT("/snippets/:id", updateSnippet)
	// DELETE /snippets/:id - Delete a snippet
	r.DELETE("/snippets/:id", deleteSnippet)

	// Start the server
	r.Run(":8080") // listen and serve on 0.0.0.0:8080
}

// getSnippets returns all snippets
func getSnippets(c *gin.Context) {
	c.JSON(http.StatusOK, snippets)
}

// getSnippetByID returns a specific snippet by ID
func getSnippetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	for _, s := range snippets {
		if s.ID == id {
			c.JSON(http.StatusOK, s)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Snippet not found"})
}

// createSnippet creates a new snippet
func createSnippet(c *gin.Context) {
	var newSnippet Snippet
	if err := c.ShouldBindJSON(&newSnippet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newSnippet.ID = nextID
	nextID++
	snippets = append(snippets, newSnippet)

	c.JSON(http.StatusCreated, newSnippet)
}

// updateSnippet updates an existing snippet
func updateSnippet(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var updatedSnippet Snippet
	if err := c.ShouldBindJSON(&updatedSnippet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for i, s := range snippets {
		if s.ID == id {
			updatedSnippet.ID = id // Ensure ID is preserved
			snippets[i] = updatedSnippet
			c.JSON(http.StatusOK, updatedSnippet)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Snippet not found"})
}

// deleteSnippet deletes a snippet
func deleteSnippet(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	for i, s := range snippets {
		if s.ID == id {
			// Remove the snippet from the slice
			snippets = append(snippets[:i], snippets[i+1:]...)
			c.JSON(http.StatusOK, gin.H{"message": "Snippet deleted successfully"})
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Snippet not found"})
}
