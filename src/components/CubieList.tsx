import { Cubie } from "./Cubie";
import type { CubieType } from "../utils/cubeTypes";

export function CubieList({
  cubies,
  getCubieMaterials,
  prefix,
  interactiveMode = true,
}: {
  cubies: CubieType[];
  getCubieMaterials: (cubie: CubieType) => any;
  prefix?: string;
  interactiveMode?: boolean;
}) {
  return (
    <>
      {cubies.map((cubie) => (
        <Cubie
          key={cubie.id}
          position={cubie.position}
          orientation={cubie.orientation}
          materials={getCubieMaterials(cubie)}
          interactiveMode={interactiveMode}
          cubieType={cubie.type}
          stickers={cubie.stickers}
        />
      ))}
    </>
  );
}
