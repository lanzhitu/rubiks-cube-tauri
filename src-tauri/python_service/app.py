from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from magiccube import Cube
from adapter import CubeAdapter

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/cube/state")
def get_cube_state():
    cube = CubeAdapter(Cube())
    return {"state": cube.get_state()}

@app.post("/cube/rotate")
def rotate_cube(move: str):
    cube = CubeAdapter(Cube())
    cube.rotate(move)
    return {"state": cube.get_state()}
