import { Cubie } from "./Cubie";
import type { CubieType } from "../utils/cubeTypes";

export function CubieList({
  cubies,
  getCubieMaterials,
}: {
  cubies: CubieType[];
  getCubieMaterials: (cubie: CubieType) => any;
  prefix?: string;
}) {
  return (
    <>
      {cubies.map((cubie) => (
        <Cubie
          key={cubie.id} // 保证 key 唯一且不变
          position={cubie.position}
          orientation={cubie.orientation}
          materials={getCubieMaterials(cubie)}
        />
      ))}
    </>
  );
}
