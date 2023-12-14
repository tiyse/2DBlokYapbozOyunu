function LoadShader(gl, type, shaderCode){

	var shader = gl.createShader(type);
	gl.shaderSource(shader, shaderCode);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
	
}

function CreateProgram(gl, VERTEX_SHADER_CODE, FRAGMENT_SHADER_CODE){

	var VertexShaderHandle  = LoadShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_CODE);
	var FragmentShaderHandle = LoadShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_CODE);

	var program = gl.createProgram();
	gl.attachShader(program, VertexShaderHandle);
	gl.attachShader(program, FragmentShaderHandle);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
		return null;
	}

	return program;

}

function parseOBJ(obj_name, text) {
  // because indices are base 1 let's just fill in the 0th data
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];

  // same order as `f` indices
  const objVertexData = [
	objPositions,
	objTexcoords,
	objNormals,
  ];

  // same order as `f` indices
  let webglVertexData = [
	[],   // positions
	[],   // texcoords
	[],   // normals
  ];

  function addVertex(vert) {
	const ptn = vert.split('/');
	ptn.forEach((objIndexStr, i) => {
	  if (!objIndexStr) {
		return;
	  }
	  const objIndex = parseInt(objIndexStr);
	  const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
	  webglVertexData[i].push(...objVertexData[i][index]);
	});
  }

  const keywords = {
	v(parts) {
	  objPositions.push(parts.map(parseFloat));
	},
	vn(parts) {
	  objNormals.push(parts.map(parseFloat));
	},
	vt(parts) {
	  // should check for missing v and extra w?
	  objTexcoords.push(parts.map(parseFloat));
	},
	f(parts) {
	  const numTriangles = parts.length - 2;
	  
	  for (let tri = 0; tri < numTriangles; ++tri) {
		addVertex(parts[0]);
		addVertex(parts[tri + 1]);
		addVertex(parts[tri + 2]);
	  }
	},
  };

  const keywordRE = /(\w*)(?: )*(.*)/;
  const lines = text.split('\n');

  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {

	const line = lines[lineNo].trim();
	if (line === '' || line.startsWith('#')) {
	  continue;
	}
	const m = keywordRE.exec(line);
	if (!m) {
	  continue;
	}
	const [, keyword, unparsedArgs] = m;
	const parts = line.split(/\s+/).slice(1);
	const handler = keywords[keyword];
	if (!handler) {
	  console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
	  continue;
	}
	handler(parts, unparsedArgs);
  }

	if(obj_name == "terrain"){

			var text_coor = [];
			for(var x = 0; x < webglVertexData[1].length/6; x++){
			
				// 1 face
				text_coor.push(1.0);
				text_coor.push(1.0);
				
				text_coor.push(0.0);
				text_coor.push(1.0);
				
				text_coor.push(1.0);
				text_coor.push(0.0);

				// 2 face
				text_coor.push(1.0);
				text_coor.push(0.0);
				
				text_coor.push(0.0);
				text_coor.push(1.0);
				
				text_coor.push(1.0);
				text_coor.push(1.0);
			}

		  return {
			position: webglVertexData[0],
			texcoord: text_coor, // webglVertexData[1]
			normal: webglVertexData[2],
		  };
		  
	}else{
		  return {
			position: webglVertexData[0],
			texcoord: webglVertexData[1],
			normal: webglVertexData[2],
		  };
	}

}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
	gl.TEXTURE_2D,
	level,
	internalFormat,
	width,
	height,
	border,
	srcFormat,
	srcType,
	pixel,
  );

  const image = new Image();
  image.onload = () => {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
	  gl.TEXTURE_2D,
	  level,
	  internalFormat,
	  srcFormat,
	  srcType,
	  image,
	);

	// WebGL1 has different requirements for power of 2 images
	// vs. non power of 2 images so check if the image is a
	// power of 2 in both dimensions.
	if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
	  // Yes, it's a power of 2. Generate mips.
	  gl.generateMipmap(gl.TEXTURE_2D);
	} else {
	  // No, it's not a power of 2. Turn off mips and set
	  // wrapping to clamp to edge
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	}
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function BarryCentric(p1, p2, p3, pos) {
	var det = parseFloat((p2[2] - p3[2]) * (p1[0] - p3[0]) + (p3[0] - p2[0]) * (p1[2] - p3[2]));
	var l1 = parseFloat(((p2[2] - p3[2]) * (pos[0] - p3[0]) + (p3[0] - p2[0]) * (pos[1] - p3[2])) / det);
	var l2 = parseFloat(((p3[2] - p1[2]) * (pos[0] - p3[0]) + (p1[0] - p3[0]) * (pos[1] - p3[2])) / det);
	var l3 = parseFloat(1.0 - l1 - l2);
	return parseFloat(l1 * p1[1] + l2 * p2[1] + l3 * p3[1]);
}

function Collision_Y_Detection(vertex_data, terrainX, terrainZ){

	var terrain_length = 100; // harita yükseklik veya genişlik
	var terrain_grid_count = 200; // haritadaki grid sayısı yani kutuların sayısı
	var gridSquareSize = parseFloat(terrain_length/terrain_grid_count); // haritadaki grid yükseklik ve genişliği float

	var gridX  = parseInt(Math.floor(terrainX / gridSquareSize)); // int
	var gridZ  = parseInt(Math.floor(terrainZ / gridSquareSize)); // int
	var gridCenter = parseInt((6 * (((terrain_grid_count-1)-gridZ) * terrain_grid_count)) + (6 * gridX));

	// alan disina cikarsa
	//if (gridX >= terrain_grid_count - 1 || gridZ >= terrain_grid_count - 1 || gridX < 0 || gridZ < 0){
	//	return false;
	//}

	// 1 grid de 2 üçgen var bu durumda onları ayırt etmek gerek >>>
	var xCoord = parseFloat((terrainX % gridSquareSize) / gridSquareSize); // mod(%) alma islemi var > float
	var zCoord = parseFloat((terrainZ % gridSquareSize) / gridSquareSize); // mod(%) alma islemi var > float

	var p5 = [vertex_data[(gridCenter * 3) + 0], vertex_data[(gridCenter * 3) + 1], vertex_data[(gridCenter * 3) + 2]];
	var p4 = [vertex_data[(gridCenter * 3) + 3], vertex_data[(gridCenter * 3) + 4], vertex_data[(gridCenter * 3) + 5]];
	var p3 = [vertex_data[(gridCenter * 3) + 6], vertex_data[(gridCenter * 3) + 7], vertex_data[(gridCenter * 3) + 8]];
	
	var p2 = [vertex_data[(gridCenter * 3) + 9], vertex_data[(gridCenter * 3) + 10], vertex_data[(gridCenter * 3) + 11]];
	var p1 = [vertex_data[(gridCenter * 3) + 12], vertex_data[(gridCenter * 3) + 13], vertex_data[(gridCenter * 3) + 14]];
	var p0 = [vertex_data[(gridCenter * 3) + 15], vertex_data[(gridCenter * 3) + 16], vertex_data[(gridCenter * 3) + 17]];

	var answer = 0.0;
	var mevcut_ucgen = [];
	if (xCoord <= (zCoord)){
		answer = BarryCentric(p5, p4, p3, [terrainX, terrainZ]);
		mevcut_ucgen = [p5, p4, p3];
	}else {
		answer = BarryCentric(p2, p1, p0, [terrainX, terrainZ]);
		mevcut_ucgen = [p2, p1, p0];
	}

	return [answer, [p0,p1,p2,p3,p4,p5], mevcut_ucgen];


}
	