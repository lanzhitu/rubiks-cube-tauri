const API_BASE_URL = "http://127.0.0.1:8000";

export async function resetCube() {
  const response = await fetch(`${API_BASE_URL}/cube/reset`, { method: "POST" });
  return response.ok ? (await response.json()).state : null;
}

export async function getCubeState() {
  const response = await fetch(`${API_BASE_URL}/cube/state`);
  return response.ok ? (await response.json()).state : null;
}

export async function rotateCube(moves: string) {
  const response = await fetch(`${API_BASE_URL}/cube/rotate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ move: moves })
  });
  return response.ok ? (await response.json()).state : null;
}

export async function setCubeState(state: string) {
  const response = await fetch(`${API_BASE_URL}/cube/set_state`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state })
  });
  return response.ok ? (await response.json()).state : null;
}

export async function isCubeSolved() {
  const response = await fetch(`${API_BASE_URL}/cube/is_solved`);
  return response.ok ? (await response.json()).solved : false;
}

export async function solveCube() {
  const response = await fetch(`${API_BASE_URL}/cube/solve`);
  return response.ok ? (await response.json()).solution : null;
}

export async function scrambleCube() {
  const response = await fetch(`${API_BASE_URL}/cube/scramble`, { method: "POST" });
  return response.ok ? (await response.json()).state : null;
}