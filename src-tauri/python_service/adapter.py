"""
Adapter for different Rubik's Cube solving engines or logic modules.
Define a standard interface for the core logic.
"""

class CubeAdapter:
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
        # Should return a list of moves to solve the cube
        raise NotImplementedError("Implement in subclass or inject solver.")
