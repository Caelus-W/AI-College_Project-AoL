import uvicorn

if __name__ == "__main__":
    # Start the backend FastAPI server
    # Running with reload=True dynamically updates the server during development
    print("Starting SmartTB Screen FastAPI Backend Server...")
    print("Access the API Swagger documentation at http://127.0.0.1:8000/docs")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
