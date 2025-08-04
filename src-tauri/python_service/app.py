from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from magiccube import Cube
from adapter import CubeAdapter


app = FastAPI()

# 全局魔方实例，保证状态同步
global_cube = CubeAdapter(Cube())

# 放宽 CORS 配置，允许所有来源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/cube/state")
def get_cube_state():
    return {"state": global_cube.get_state()}


# 单步旋转
@app.post("/cube/rotate")
def rotate_cube(move: str = Body(..., embed=True)):
    global_cube.rotate(move)
    return {"state": global_cube.get_state()}

# 批量旋转（多个动作）
@app.post("/cube/rotate_many")
def rotate_many(moves: list = Body(..., embed=True)):
    global_cube.rotate(moves)
    return {"state": global_cube.get_state()}

# 新增：设置魔方状态
@app.post("/cube/set_state")
def set_cube_state(state: str = Body(..., embed=True)):
    global_cube.set_state(state)
    return {"state": global_cube.get_state()}

# 新增：判断魔方是否已解
@app.get("/cube/is_solved")
def is_cube_solved():
    return {"is_solved": global_cube.is_solved()}

# 新增：获取魔方解法（如有实现）
@app.get("/cube/solve")
def solve_cube():
    try:
        moves = global_cube.solve()
    except NotImplementedError:
        moves = []
    return {"solution": moves}


# 新增：重置魔方
@app.post("/cube/reset")
def reset_cube():
    state = global_cube.reset()
    return {"state": state}

@app.get("/cube/all_pieces")
def get_all_pieces():
    pieces = global_cube.get_all_pieces()
    # 转换为可序列化格式
    serializable = {
        str(coord): piece.__dict__ if hasattr(piece, '__dict__') else str(piece)
        for coord, piece in pieces.items()
    }
    return {"pieces": serializable}

# 新增：打乱魔方
@app.post("/cube/scramble")
def scramble_cube():
    state = global_cube.scramble()
    return {"state": state}

# 允许直接运行 app.py 启动 FastAPI 服务
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)