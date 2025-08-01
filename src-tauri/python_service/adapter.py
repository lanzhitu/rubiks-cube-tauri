"""
Adapter for different Rubik's Cube solving engines or logic modules.
Define a standard interface for the core logic.
"""

class CubeAdapter:
    def scramble(self):
        self.cube.scramble()
        return self.get_state()
    def __init__(self, cube_impl):
        self.cube = cube_impl

    def rotate(self, moves):
        return self.cube.rotate(moves)

    def get_state(self):
        return self.cube.get()

    def set_state(self, state):
        return self.cube.set(state)

    def is_solved(self):
        return self.cube.is_done()

    def reset(self):
        self.cube.reset()
        return self.get_state()
    
    def get_all_pieces(self):
        return self.cube.get_all_pieces()

    def solve(self):
        from magiccube import BasicSolver
        solver = BasicSolver(self.cube)
        moves = solver.solve()
        # 转为字符串列表，确保可序列化
        return [str(move) for move in moves]
