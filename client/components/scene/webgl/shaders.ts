interface AttributeInfo extends WebGLActiveInfo {
  location: number
}
interface UniformInfo extends WebGLActiveInfo {
  location: WebGLUniformLocation
}
export type ProgramInfo = { attributes: Map<string, AttributeInfo>, uniforms: Map<string, UniformInfo> };

export function initShaderProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): [WebGLProgram, ProgramInfo] {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const shaderProgram = gl.createProgram();
  if (shaderProgram === null) throw new Error('Failed to create shader program.');

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    const errorMessage = gl.getShaderInfoLog(shaderProgram);
    gl.deleteProgram(shaderProgram);
    throw new Error(`Unable to initialize the shader program: ${errorMessage}`);
  }

  // Now that we've successfully linked the program, free the shader objects
  gl.detachShader(shaderProgram, vertexShader);
  gl.detachShader(shaderProgram, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  const attributes = new Map<string, AttributeInfo>();
  const numberOfAttributes: number = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numberOfAttributes; i++) {
    const activeInfo = gl.getActiveAttrib(shaderProgram, i);
    if (activeInfo === null) throw new Error(`Failed to get attribute information at location ${i}`);

    // Since we've just successfully queried information about this attribute, it had better have a location...
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const location = gl.getAttribLocation(shaderProgram, activeInfo.name)!;
    const withLocation = { ...activeInfo, location } as AttributeInfo;
    attributes.set(activeInfo.name, withLocation);
  }

  const uniforms = new Map<string, UniformInfo>();
  const numberOfUniforms: number = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < numberOfUniforms; i++) {
    const activeInfo = gl.getActiveUniform(shaderProgram, i);
    if (activeInfo === null) throw new Error(`Failed to get uniform information at location ${i}`);

    // See note on previous assertion.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const location = gl.getUniformLocation(shaderProgram, activeInfo.name)!;
    const withLocation = { ...activeInfo, location } as UniformInfo;
    uniforms.set(activeInfo.name, withLocation);
  }

  return [shaderProgram, { attributes, uniforms }];
}

export function loadShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (shader === null) throw new Error('Failed to create shader.');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorMessage = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`An error occurred compiling the shaders: ${errorMessage}`);
  }

  return shader;
}
