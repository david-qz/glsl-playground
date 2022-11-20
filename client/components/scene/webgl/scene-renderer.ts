import Mesh from './mesh';
import { initShaderProgram, type ProgramInfo } from './shaders';
import { mat4 } from 'gl-matrix';

export default class SceneRenderer {
  private gl: WebGL2RenderingContext;
  private mesh?: Mesh;
  private program?: WebGLProgram;
  private programInfo?: ProgramInfo;
  private running = false;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  loadProgram(vertexShaderSource: string, fragmentShaderSource: string): void {
    const result = initShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    if (!result.program) return;

    if (this.program) this.gl.deleteProgram(this.program);
    this.program = result.program;
    this.programInfo = result.programInfo;
  }

  setMesh(mesh: Mesh) {
    this.mesh = mesh;
  }

  setRunning(running: boolean) {
    if (running && !this.running) {
      // Start the render loop
      requestAnimationFrame(this.render.bind(this));
    }
    this.running = running;
  }

  render() {
    const gl = this.gl;

    const canvas = gl.canvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this.mesh && this.program && this.programInfo) {
      const fieldOfView = 45 * Math.PI / 180;
      const aspect = gl.canvas.width / gl.canvas.height;
      const zNear = 0.1;
      const zFar = 100.0;

      const projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
      mat4.rotateY(modelViewMatrix, modelViewMatrix, performance.now() / 600);
      mat4.rotateX(modelViewMatrix, modelViewMatrix, performance.now() / 1200);

      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);

      const buffer = gl.createBuffer();
      if (buffer === null) throw new Error('Failed to create gl buffer.');
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      // FIXME: Make it so the program is verified ahead of time so we don't need to null check this stuff!
      const positionAttributeInfo = this.programInfo.attributes.get('aVertexPosition');
      if (positionAttributeInfo) {
        gl.enableVertexAttribArray(positionAttributeInfo.location);
        gl.vertexAttribPointer(positionAttributeInfo.location, 3, gl.FLOAT, false, 24, 0);
      }

      const normalAttributeInfo = this.programInfo.attributes.get('aVertexNormal');
      if (normalAttributeInfo) {
        gl.enableVertexAttribArray(normalAttributeInfo.location);
        gl.vertexAttribPointer(normalAttributeInfo.location, 3, gl.FLOAT, true, 24, 12);
      }

      // Tell WebGL to use our program when drawing
      gl.useProgram(this.program);

      // Set the shader uniforms
      const projectionMatrixUniformInfo = this.programInfo.uniforms.get('uProjectionMatrix');
      if (projectionMatrixUniformInfo) {
        gl.uniformMatrix4fv(projectionMatrixUniformInfo.location, false, projectionMatrix);
      }
      const modelViewMatrixUniformInfo = this.programInfo.uniforms.get('uModelViewMatrix');
      if (modelViewMatrixUniformInfo) {
        gl.uniformMatrix4fv(modelViewMatrixUniformInfo.location, false, modelViewMatrix);
      }
      const normalMatrixUniformInfo = this.programInfo.uniforms.get('uNormalMatrix');
      if (normalMatrixUniformInfo) {
        gl.uniformMatrix4fv(normalMatrixUniformInfo.location, false, normalMatrix);
      }

      // Render the mesh
      gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertexData, gl.STATIC_DRAW, 0);
      gl.drawArrays(gl.TRIANGLES, 0, this.mesh.vertexCount);
    }

    // Continue render loop if we're still running
    if (this.running) requestAnimationFrame(this.render.bind(this));
  }
}
