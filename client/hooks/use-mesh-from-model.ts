import { useEffect, useState } from 'react';
import Mesh from '../components/scene/webgl/mesh';

type MeshState = {
  mesh?: Mesh,
  loading: boolean,
  error: boolean
};

export default function useMeshFromModel(url: string): MeshState {
  const [meshState, setMeshState] = useState<MeshState>({ loading: true, error: false });

  useEffect(() => {
    (async () => {
      const response = await fetch(url);

      if (!response.ok) {
        setMeshState({ loading: false, error: true });
        return;
      }

      const rawData = await response.text();
      const mesh = Mesh.fromObj(rawData);

      setMeshState({ mesh, loading: false, error: false });
    })();
  }, []);

  return meshState;
}
