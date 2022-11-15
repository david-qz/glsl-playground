export const exampleFragmentShader =
`precision highp float;

varying vec3 vNormal;

void main() {
  const float ambientIntensity = 0.1;
  const vec3 materialColor = vec3(1.0, 1.0, 1.0);

  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
  float intensity = max(dot(normal, lightDirection), ambientIntensity);

  gl_FragColor = vec4(materialColor * intensity, 1.0);
}
`;

export const exampleVertexShader =
`attribute vec4 aVertexPosition;
attribute vec4 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;

void main() {
  vNormal = (uNormalMatrix * aVertexNormal).xyz;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;
