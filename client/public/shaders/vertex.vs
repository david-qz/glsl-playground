attribute vec4 aVertexPosition;
attribute vec4 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

varying vec3 vNormal;

void main() {
    vNormal = (uNormalMatrix * aVertexNormal).xyz;
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
