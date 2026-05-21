//a program to create a spinning cube with WebGL
//an OpenGL web API, which allows the browser access
//to your GPU for complex graphics processing

//@Author Iosefa Sunia

main();
  //INIT AND COMPILE SHADERS
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success)
      return shader;
    
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
  
  //create CPU program
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
  
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

//TRANSFORMS
function xRotationMat(theta){
  let c = Math.cos(theta);
  let s = Math.sin(theta);
  
  return new Float32Array([
    1, 0, 0, 0,
    0, c,-s, 0,
    0, s, c, 0,
    0, 0, 0, 1,
  ]);
}

function yRotationMat(phi){
  let c = Math.cos(phi);
  let s = Math.sin(phi);
  
  return new Float32Array([
    c, 0, s, 0,
    0, 1, 0, 0,
   -s, 0, c, 0,
    0, 0, 0, 1,
  ]);
}

function zRotationMat(rho){
  let c = Math.cos(rho);
  let s = Math.sin(rho);
  
  return new Float32Array([
    c,-s, 0, 0,
    s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

function multiplyMat4(a, b) {
  const out = new Float32Array(16);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {

      let sum = 0;

      for (let i = 0; i < 4; i++) {
        sum += a[i + row * 4] * b[col + i * 4];
      }
      out[col + row * 4] = sum;
    }
  }
  return out;
}

function generateTransforms(theta, phi, rho, time){
  var rotx = xRotationMat(theta * time);
  var roty = yRotationMat(phi * time);
  var rotz = zRotationMat(rho * time);
  
  var step = multiplyMat4(rotx, roty);
  var step2 = multiplyMat4(step, rotz);
  
  console.log(step2);
  
  return step2;
}

function main(){
  //init canvas and gl API
  const canvas = document.querySelector("#gl-canvas");
  
  const gl = canvas.getContext("webgl2");
  if (gl === null) 
    alert("No WEBGL available");  
  
  //shaders
  const vss = `#version 300 es
    in vec4 in_position;
    uniform mat4 transform; 

    void main() {

      float poop = cos(in_position.x);
      gl_Position = 0.5 * transform * in_position;
    }
  `;
  
  const fss = `#version 300 es
    precision highp float;

    out vec4 outColor;

    void main() {
      outColor = vec4(1, 0, 0, 1);
    }
  `;
  
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vss);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fss);
  
  //init program, attach shaders
  var program = createProgram(gl, vertexShader, fragmentShader);
  

  
  //CUBE VERTICES
  //These will be different from our triangles, as we are using a THIRD dimension
  //This means of course, we will have to project our 3d data onto our 2d screen with a transformation matrix
  //Note that GLSL supports matrix multiplication. Thus we can just pass our transformation mats to the shader, and perform calculations there. 
var cube_data = [
  // FRONT
  0,0,0,
  .5,0,0,
  .5,.5,0,

  0,0,0,
  .5,.5,0,
  0,.5,0,

  // BACK
  .5,0,-.5,
  0,0,-.5,
  0,.5,-.5,

  .5,0,-.5,
  0,.5,-.5,
  .5,.5,-.5,

  // LEFT
  0,0,-.5,
  0,0,0,
  0,.5,0,

  0,0,-.5,
  0,.5,0,
  0,.5,-.5,

  // RIGHT
  .5,0,0,
  .5,0,-.5,
  .5,.5,-.5,

  .5,0,0,
  .5,.5,-.5,
  .5,.5,0,

  // TOP
  0,.5,0,
  .5,.5,0,
  .5,.5,-.5,

  0,.5,0,
  .5,.5,-.5,
  0,.5,-.5,

  // BOTTOM
  0,0,-.5,
  .5,0,-.5,
  .5,0,0,

  0,0,-.5,
  .5,0,0,
  0,0,0,
];
  
  
  gl.useProgram(program);
  
    //CREATE ATTRIBUTES, UNIFORMS, BUFFERS, etc.
  var positionAttributeLocation = gl.getAttribLocation(program, "in_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_data), gl.STATIC_DRAW);
  
  
  var mvpMat = generateTransforms(2, 1, 3, 2.0);
  var transformUniLocation = gl.getUniformLocation(program, "transform");
  gl.uniformMatrix4fv(transformUniLocation, false, mvpMat);
  // const value = gl.getUniform(program, transformUniLocation);
  // console.log("confirmation:" + value);
  
  //vertex array object
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  
  gl.enableVertexAttribArray(positionAttributeLocation);
  
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);
  
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  gl.bindVertexArray(vao);
 
  
  //opengl config
  gl.frontFace(gl.CCW);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
    
  //DRAWING
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = cube_data.length/3;
  gl.drawArrays(primitiveType, offset, count);
  
  
  //TODO: request animation frame is how we step our time value
  //It is a JS api function that requests a new animation frame (no shit)
  function render(time){
    time *= 0.001;

    var mvpMat = generateTransforms(12, 3, 4, time);
    gl.uniformMatrix4fv(transformUniLocation, false, mvpMat);

    gl.clearColor(1., 1., 1., 1.); 
    gl.clear(gl.COLOR_BUFFER_BIT);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = cube_data.length/3;
    gl.drawArrays(gl.TRIANGLES, 0, cube_data.length/3);

    requestAnimationFrame(render);
  }
  
  render();
}