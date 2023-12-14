function TetriminoBoxSelectedProgram(tetrimino_index, ShaderProgram, kutu, selected, x, y){

	if(kutu[2] == 1){
		
		var size = parseInt(((row-1)*grid)/3); // kutu orta
		var box_size = 25;
		if(mouse_click == true && selected == true){
			box_size = 50;
		}else{
			box_size = 25;
		}
		
		var kutu_data = puzzle.random_box_tetrimino(tetrimino_index, size, box_size, kutu);
		var positionsx = kutu_data[0];
		var colorss = kutu_data[1];
		
		var translationMatrixxx = mat4.create();

		if(mouse_click == true && selected == true){
			mat4.translate(translationMatrixxx, translationMatrixxx, [mouseX-x, mouseY-y, 0.0]);
		}else{
			mat4.translate(translationMatrixxx, translationMatrixxx, [BlokPozisyonX+(132/2)-(25*4/2), BlokPozisyonY-(132/2), 0]);
		}
		gl.uniformMatrix4fv(gl.getUniformLocation(ShaderProgram, "translationMatrix"), false, translationMatrixxx);

		let vertexBufferss = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferss);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionsx), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferss);

		let aVertexPositionss = gl.getAttribLocation(ShaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(aVertexPositionss);
		gl.vertexAttribPointer(aVertexPositionss, 2, gl.FLOAT, false, 0, 0); 
		
		let vertexColorBufferxx = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferxx);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorss), gl.STATIC_DRAW);

		var vVertexColors = gl.getAttribLocation(ShaderProgram, "aVertexColor");
		gl.vertexAttribPointer(vVertexColors, 3, gl.FLOAT, false, 0, 0); 
		gl.enableVertexAttribArray(vVertexColors);
		
		gl.drawArrays(gl.TRIANGLES, 0, positionsx.length);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.disableVertexAttribArray(0);
		
	}
				
}

function TetriminoTahtaProgram(ShaderProgram){
	const translationMatrix = mat4.create();
	mat4.translate(translationMatrix, translationMatrix, [TahtaPozisyonX, TahtaPozisyonY, 0.0]); // Adjust the translation (x, y, z) as needed


	const translationMatrixLocation = gl.getUniformLocation(ShaderProgram, "translationMatrix");
	gl.uniformMatrix4fv(translationMatrixLocation, false, translationMatrix);


	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	let aVertexPosition = gl.getAttribLocation(ShaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(aVertexPosition);
	gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0); 

	let vertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(OBjColor), gl.STATIC_DRAW);

	var vVertexColor = gl.getAttribLocation(ShaderProgram, "aVertexColor");
	gl.vertexAttribPointer(vVertexColor, 3, gl.FLOAT, false, 0, 0); 
	gl.enableVertexAttribArray(vVertexColor);

	gl.drawArrays(gl.TRIANGLES, 0, OBjPosition.length); // TRIANGLES | LINE_LOOP | POINTS | TRIANGLE_STRIP
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.disableVertexAttribArray(0);
}

function TetriminoBoxProgram(ShaderProgram){
	const translationMatrixx = mat4.create();
	mat4.translate(translationMatrixx, translationMatrixx, [BlokPozisyonX, BlokPozisyonY, 0.0]);
	const translationMatrixLocationx = gl.getUniformLocation(ShaderProgram, "translationMatrix");
	gl.uniformMatrix4fv(translationMatrixLocationx, false, translationMatrixx);
	
	const positions = [];
	for(var x = 0; x < 3; x++){
	
		var size = parseInt(((row-1)*grid)/3);
		positions.push(x*size,0);
		positions.push(x*size,-size);
		positions.push((x+1)*size,-size);
		
		positions.push((x+1)*size,-size);
		positions.push((x+1)*size,0);
		positions.push(x*size,0);
		
	}
	
	const colors = [
		0,0,0,
		0,0,0,
		0,0,0,
		
		0,0,0,
		0,0,0,
		0,0,0,
	];
	let vertexBuffers = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers);

	let aVertexPositions = gl.getAttribLocation(ShaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(aVertexPositions);
	gl.vertexAttribPointer(aVertexPositions, 2, gl.FLOAT, false, 0, 0); 
	
	
	let vertexColorBufferx = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferx);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	var vVertexColor = gl.getAttribLocation(ShaderProgram, "aVertexColor");
	gl.vertexAttribPointer(vVertexColor, 3, gl.FLOAT, false, 0, 0); 
	gl.enableVertexAttribArray(vVertexColor);

	gl.drawArrays(gl.LINE_LOOP, 0, positions.length);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.disableVertexAttribArray(0);
}