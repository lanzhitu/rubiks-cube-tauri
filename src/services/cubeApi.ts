
const API_BASE_URL = "http://127.0.0.1:8000";

export async function getCubeState(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/cube/state`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.state;
  } catch (error) {
    console.error("Error fetching cube state:", error);
    return null;
  }
}

export async function rotateCube(moves: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/cube/rotate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ move: moves })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.state;
  } catch (error) {
    console.error("Error rotating cube:", error);
    return null;
  }
}

export async function setCubeState(state: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/cube/set_state`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.state;
  } catch (error) {
    console.error("Error setting cube state:", error);
    return null;
  }
}

export async function isCubeSolved(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/cube/is_solved`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.solved;
  } catch (error) {
    console.error("Error checking if cube is solved:", error);
    return false;
  }
}

export async function solveCube(): Promise<string[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/cube/solve`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.moves;
  } catch (error) {
    console.error("Error solving cube:", error);
    return null;
  }
}
