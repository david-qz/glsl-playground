import type { Dispatch } from 'react';
import type { Loading, LoadingStateAction } from './use-loader';
import Mesh from '../components/scene/webgl/mesh';
import { Loader } from './use-loader';

export default function useMeshFromModel(url: string): [Loading<Mesh>, Dispatch<LoadingStateAction<Mesh>>] {
  return Loader.useLoader<Mesh>(async () => {
    const response = await fetch(url);

    if (!response.ok) {
      return new Error(`Failed to load model at ${url}`);
    }

    const rawData = await response.text();
    const mesh = Mesh.fromObj(rawData);

    return mesh;
  }, [url]);
}
