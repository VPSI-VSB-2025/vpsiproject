from fastapi import FastAPI

app = FastAPI()

# Import and register endpoints here 


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)