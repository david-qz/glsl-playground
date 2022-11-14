export default class Mesh {
  vertexData: Float32Array;
  vertexCount: number;

  constructor(vertices: Float32Array, vertexCount: number) {
    this.vertexData = vertices;
    this.vertexCount = vertexCount;
  }
}
