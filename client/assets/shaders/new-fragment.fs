#version 300 es

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
