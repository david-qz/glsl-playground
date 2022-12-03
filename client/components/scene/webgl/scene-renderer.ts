import Mesh from './mesh';
import { compileProgram, ProgramCompilationErrors, type ProgramInfo } from './shaders';
import { mat4, vec2 } from 'gl-matrix';

export default class SceneRenderer {
  private gl: WebGL2RenderingContext;
  private mesh?: Mesh;
  private program?: WebGLProgram;
  private programInfo?: ProgramInfo;
  private running = false;
  private eulerAngles: vec2;
  private cameraOffset: number;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.eulerAngles = vec2.create();
    this.cameraOffset = 6;
  }

  loadProgram(vertexShaderSource: string, fragmentShaderSource: string): ProgramCompilationErrors | undefined {
    const result = compileProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    if (!result.program) return result.errors;

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
      const zFar = 150.0;

      const projectionMatrix = mat4.create();
      mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -this.cameraOffset]);

      const rotationMatrix = mat4.create();
      mat4.rotateX(rotationMatrix, rotationMatrix, this.eulerAngles[0]);
      mat4.rotateY(rotationMatrix, rotationMatrix, this.eulerAngles[1]);
      mat4.multiply(modelViewMatrix, modelViewMatrix, rotationMatrix);

      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);

      const vertexBuffer = gl.createBuffer();
      if (vertexBuffer === null) throw new Error('Failed to create gl buffer.');
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

      const indexBuffer = gl.createBuffer();
      if (indexBuffer === null) throw new Error('Failed to create gl buffer.');
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      this.setUpVertexAttributes();

      gl.useProgram(this.program);
      this.setUpUniforms(projectionMatrix, modelViewMatrix, normalMatrix);

      // Render the mesh
      gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertices, gl.STATIC_DRAW);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indices, gl.STATIC_DRAW);
      gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_INT, 0);
    }

    // Continue render loop if we're still running
    if (this.running) requestAnimationFrame(this.render.bind(this));
  }

  private setUpVertexAttributes() {
    if (!this.programInfo) return;
    const gl = this.gl;

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
  }

  private setUpUniforms(projectionMatrix: mat4, modelViewMatrix: mat4, normalMatrix: mat4): void {
    if (!this.programInfo) return;
    const gl = this.gl;

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
  }

  getEulerAngles(): vec2 {
    return vec2.copy(vec2.create(), this.eulerAngles);
  }

  setEulerAngles(eulerAngles: vec2) {
    // Gimbal lock the incoming rotation
    eulerAngles[0] = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, eulerAngles[0]));
    vec2.copy(this.eulerAngles, eulerAngles);
  }

  get cameraDistance(): number {
    return this.cameraOffset;
  }

  set cameraDistance(distance: number) {
    this.cameraOffset = Math.max(0, Math.min(distance, 100));
  }
}
