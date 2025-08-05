import { Cubie } from "./Cubie";
import type { CubieType } from "../utils/cubeTypes";

export function CubieList({
  cubies,
  getCubieMaterials,
  prefix = "static",
}: {
  cubies: CubieType[];
  getCubieMaterials: (cubie: CubieType) => any;
  prefix?: string;
}) {
  return (
    <>
      {cubies.map((cubie) => (
        <Cubie
          key={`${prefix}-${cubie.id}`}
          position={cubie.position}
          orientation={cubie.orientation}
          materials={getCubieMaterials(cubie)}
        />
      ))}
    </>
  );
}
