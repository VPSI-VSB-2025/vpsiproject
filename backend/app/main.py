from fastapi import FastAPI

from core.database import create_tables

app = FastAPI()

# Import and register endpoints here 

create_tables()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)