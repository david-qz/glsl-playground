import { useEffect, useState } from 'react';
import Mesh from '../components/scene/webgl/mesh';

type MeshState = {
  mesh: Mesh | undefined,
  loading: boolean,
  error: boolean
};

export default function useMeshFromModel(url: string): MeshState {
  const [mesh, setMesh] = useState<Mesh>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const response = await fetch(url);

      if (!response.ok) {
        setError(true);
        setLoading(false);
        return;
      }

      const rawData = await response.text();
      const mesh = Mesh.fromObj(rawData);

      setMesh(mesh);
      setLoading(false);
    })();
  }, []);

  return {
    mesh,
    loading,
    error
  };
}
