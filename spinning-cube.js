//a program to create a spinning cube with WebGL
//an OpenGL web API, which allows the browser access
//to your GPU for complex graphics processing

//@Author Iosefa Sunia

import { mat4, mat3, vec3, vec4 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.4/+esm';


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
function xRotationMat(theta) {
  let c = Math.cos(theta);
  let s = Math.sin(theta);

  return new Float32Array([
    1, 0, 0, 0,
    0, c, -s, 0,
    0, s, c, 0,
    0, 0, 0, 1,
  ]);
}

function yRotationMat(phi) {
  let c = Math.cos(phi);
  let s = Math.sin(phi);

  return new Float32Array([
    c, 0, s, 0,
    0, 1, 0, 0,
    -s, 0, c, 0,
    0, 0, 0, 1,
  ]);
}

function zRotationMat(rho) {
  let c = Math.cos(rho);
  let s = Math.sin(rho);

  return new Float32Array([
    c, -s, 0, 0,
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

function generateTransforms(theta, phi, rho, time) {
  var rotx = xRotationMat(theta * time);
  var roty = yRotationMat(phi * time);
  var rotz = zRotationMat(rho * time);

  var step = multiplyMat4(rotx, roty);
  var step2 = multiplyMat4(step, rotz);

  return step2;
}

//TODO: we can generate surface normal vectors by taking the cross product of two of our vertex edges, 
// creating a vector orthogonal to the plane which both lie on
// We must make calculations post transformation for any coordinate which will translate/rotate/scale in any way
function generateNormals(transform_mat) {
  //Remove padding from transformation matrix
  const raw_transformation = new Float32Array([
    transform_mat[0], transform_mat[1], transform_mat[2],
    transform_mat[4], transform_mat[5], transform_mat[6],
    transform_mat[8], transform_mat[9], transform_mat[10],
  ]);

  var outmat = mat3.create();

  //normal generation is based on finding the transpose of the inverse of our model matrix
  //find a library, doing it by hand will be cumbersome
  //we will use glmatrix, an oss matrix and vector math library, optimized for webgl usage

  mat3.invert(outmat, raw_transformation);
  mat3.transpose(outmat, outmat);

  // console.log(outmat);

  return outmat;
}

function main() {
  //init canvas and gl API
  const canvas = document.querySelector("#gl-canvas");

  const gl = canvas.getContext("webgl2");
  if (gl === null)
    alert("No WEBGL available");

  var cube_data = [
    // FRONT
    0, 0, 0,
    .5, 0, 0,
    .5, .5, 0,

    0, 0, 0,
    .5, .5, 0,
    0, .5, 0,

    // BACK
    .5, 0, -.5,
    0, 0, -.5,
    0, .5, -.5,

    .5, 0, -.5,
    0, .5, -.5,
    .5, .5, -.5,

    // LEFT
    0, 0, -.5,
    0, 0, 0,
    0, .5, 0,

    0, 0, -.5,
    0, .5, 0,
    0, .5, -.5,

    // RIGHT
    .5, 0, 0,
    .5, 0, -.5,
    .5, .5, -.5,

    .5, 0, 0,
    .5, .5, -.5,
    .5, .5, 0,

    // TOP
    0, .5, 0,
    .5, .5, 0,
    .5, .5, -.5,

    0, .5, 0,
    .5, .5, -.5,
    0, .5, -.5,

    // BOTTOM
    0, 0, -.5,
    .5, 0, -.5,
    .5, 0, 0,

    0, 0, -.5,
    .5, 0, 0,
    0, 0, 0,
  ];

  var cube_norms = [
    //FRONT
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    //BACK
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    //LEFT
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    //RIGHT
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    //TOP
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    //BOTTOM
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
  ];

  //shaders
  const vss = `#version 300 es
    in vec4 in_position;
    in vec3 in_normal;

    uniform mat4 transform; 
    uniform mat3 mat_normal;

    out vec3 v_normal;
    out float lightAngle;

    void main() {
      gl_Position = transform * in_position;
      
      //vec3 ambientLight = vec3(0.3, 0.3, 0.3) //ambient brightness intensity
      vec3 light_color = vec3(1,1,1);                  //light color
      vec3 light_direction = normalize(vec3(0,5,13));  //direction light is coming from
      
      vec3 transformed_normal = normalize(vec3(mat_normal * in_normal));         //surface normals, accounting for surface transformation

      float light_angle = max(dot(transformed_normal.xyz, light_direction), 0.0);  //cos between light direction and normals

      vec3 final_lighting = light_angle * light_color; //Add ambient light
    }
  `;

  const fss = `#version 300 es
    precision highp float;

    in vec3 v_nomral;
    in float lightAngle;
    
    out vec4 outColor;

    void main() {
      outColor = vec4(1, 0, 0, 1);
    }
  `;
  
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vss);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fss);

  //init program, attach shaders
  var program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  //CREATE ATTRIBUTES, UNIFORMS, BUFFERS, etc.
  var positionAttributeLocation = gl.getAttribLocation(program, "in_position");
  var normAttributeLocation = gl.getAttribLocation(program, "in_normal");
  var transformUniLocation = gl.getUniformLocation(program, "transform");
  var normalUniLoc = gl.getUniformLocation(program, "mat_normal");
  
  //VAO INIT
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  //Bind buffers to global buffer space, assign data, bind buffers to attributes, set attribute metadata
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_data), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  var normBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_norms), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(normAttributeLocation);
  gl.vertexAttribPointer(
    normAttributeLocation, size, type, normalize, stride, offset);

  //WEBGL CONFIG
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.frontFace(gl.CCW);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  //Rendering function (main loop)
  function render(time) {
    time *= 0.001;

    var modelMat = generateTransforms(12, 3, 4, time);
    gl.uniformMatrix4fv(transformUniLocation, false, modelMat);



    var normMat = generateNormals(modelMat);
    console.log(normalUniLoc);
    console.log(normMat);
    gl.uniformMatrix3fv(normalUniLoc, false, normMat);

    gl.clearColor(1., 1., 1., 1.);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //bind the current VAO
    gl.bindVertexArray(vao);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = cube_data.length / 3;
    gl.drawArrays(gl.TRIANGLES, 0, cube_data.length / 3);

    requestAnimationFrame(render);
  }

  render();
}