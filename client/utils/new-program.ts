import type { ProgramData } from '../../common/api-types';

export function createNewProgram(programId: string, userId: string): ProgramData {
  return {
    id: programId,
    userId,
    title: 'New Program',
    vertexSource: exampleVertexShader,
    fragmentSource: exampleFragmentShader,
    didCompile: true,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };
}

export const exampleFragmentShader =
`#version 300 es

precision highp float;

in vec3 normal;
out vec4 fragment_color;

void main() {
  const vec3 materialColor = vec3(1.0, 1.0, 1.0);
  const vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
  const float ambientLightIntensity = 0.1;

  vec3 normal = normalize(normal);
  float lightIntensity = max(dot(normal, lightDirection), ambientLightIntensity);

  fragment_color = vec4(materialColor * lightIntensity, 1.0);
}
`;

export const exampleVertexShader =
`#version 300 es

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec4 aVertexPosition;
in vec4 aVertexNormal;
out vec3 normal;

void main() {
  normal = (uNormalMatrix * aVertexNormal).xyz;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;
