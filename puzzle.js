// Tetrimino şekilleri ve renkleri
var shapes = [
	[[1, 1, 1, 1], [0, 0, 0, 0]], // I
	[[1, 1, 1], [0, 1, 0]],       // T
	[[1, 1, 1], [1, 0, 0]],       // L
	[[1, 1, 1], [0, 0, 1]],       // J
	[[1, 1], [1, 1]],             // O
	[[1, 1], [1, 0]],             // S
	[[1, 1], [0, 1]],             // Z
	[[1, 0, 1], [1, 1, 1]],       // U
	[[1], [0]]                    // .
];

var colors = [
	"#00FFFF", // Cyan (I)
	"#FFA500", // Orange (T)
	"#FF0000", // Red (L)
	"#0000FF", // Blue (J)
	"#FFFF00", // Yellow (O)
	"#00FF00", // Green (S)
	"#FF00FF", // Magenta (Z)
	"#FF00FF", // Magenta (Z)
	"#FF00FF"  // Magenta (Z)
];

var board_subdiv = {row:9, col: 9, grid: 50};

// Tetrimino sınıfı
class Tetrimino {
	
	// Tetrimino konfigürasyon
    constructor(shape, color, board_subdiv) {
        this.shape = shape;
        this.color = color;
        this.board_subdiv = board_subdiv;
		this.board = [];
		this.board_next_item = [];
		this.puzzle_1_is = false;
		this.puzzle_2_is = false;
		this.puzzle_3_is = false;
    }

	// Tetrimino tahta oluşturma
	create(){

		var OBjVertex = [];
		for(var y = 0; y < this.board_subdiv.row; y++){
			for(var x = 0; x < this.board_subdiv.col; x++){
				OBjVertex.push([x*this.board_subdiv.grid,y*this.board_subdiv.grid]);
			}
		}

		var OBjPosition = [];
		var OBjColor = [];
		for(var y = 0; y < (this.board_subdiv.row - 1); ++y){
		
			this.board[y] = Array(this.board_subdiv.col-1).fill(0); // Tetris oyunu tahtası Arka Plan(Algortima)
			
			for(var x = 0; x < (this.board_subdiv.col - 1); ++x){
				var start = y * this.board_subdiv.col + x;

				var i0 = start;
				var i1 = (start + 1);
				var i2 = (start + this.board_subdiv.col);

				var i3 = (start + 1);
				var i4 = (start + 1 + this.board_subdiv.col);
				var i5 = (start + this.board_subdiv.col);

				OBjPosition.push(OBjVertex[i0][0], OBjVertex[i0][1]); OBjColor.push(1.0, 1.0, 1.0);
				OBjPosition.push(OBjVertex[i1][0], OBjVertex[i1][1]); OBjColor.push(1.0, 1.0, 1.0);
				OBjPosition.push(OBjVertex[i2][0], OBjVertex[i2][1]); OBjColor.push(1.0, 1.0, 1.0);

				OBjPosition.push(OBjVertex[i3][0], OBjVertex[i3][1]); OBjColor.push(1.0, 1.0, 1.0);
				OBjPosition.push(OBjVertex[i4][0], OBjVertex[i4][1]); OBjColor.push(1.0, 1.0, 1.0);
				OBjPosition.push(OBjVertex[i5][0], OBjVertex[i5][1]); OBjColor.push(1.0, 1.0, 1.0);

			}
		}
		OBjPosition.push(0, this.board_subdiv.grid*(this.board_subdiv.row-1));
		OBjColor.push(1.0, 1.0, 1.0);
		OBjColor.push(1.0, 1.0, 1.0);
		
		return {position: OBjPosition, color: OBjColor};
	}

	// Tetrimino grid bilgisi
	get_grid(mouseZ, mouseX){
	
		var terrain_length     = 400; // harita yükseklik veya genişlik
		var terrain_grid_count = 8; // haritadaki grid sayısı yani kutuların sayısı
		var gridSquareSize     = parseFloat(terrain_length/terrain_grid_count); // haritadaki grid yükseklik ve genişliği float

		var gridX      = parseInt(Math.floor(mouseX / gridSquareSize)); // int
		var gridZ      = parseInt(Math.floor(mouseZ / gridSquareSize)); // int
		var gridCenter = (gridX * terrain_grid_count) + (gridZ);

		/*console.log(
			gridX,
			gridZ,
			(gridX*gridZ*6),
			(gridX*gridZ*6)*3,
			(gridX*gridZ*6)*2,
			(gridX * 8) + (gridZ)
		);*/
		return {gridX: gridX, gridZ: gridZ, gridCenter: gridCenter};
		
	}

	// Rastgele bir Tetrimino oluşturma yapısı
	random_tetrimino(){
		const randomIndex = [
			Math.floor(Math.random() * this.shape.length),
			Math.floor(Math.random() * this.shape.length),
			Math.floor(Math.random() * this.shape.length)
		];
		//if(this.board_next_item.length == 0){
			this.board_next_item = [
				[
					this.shape[randomIndex[0]],
					this.color[randomIndex[0]],
					1,
					false,
					0
				],
				[
					this.shape[randomIndex[1]],
					this.color[randomIndex[1]],
					1,
					false,
					1
				],
				[
					this.shape[randomIndex[2]],
					this.color[randomIndex[2]],
					1,
					false,
					2
				]
			];
		//}
	}

	// Rastgele bir Tetrimino oluşturma
	random_box_tetrimino(box_row, size, box_size, box){
		var position = [];
		var color = [];
		for(var k = 0; k < box[0][0].length; k++){
			if(box[0][0][k] == 1){
				position.push(size * box_row + (box_size * (0 + k)), 0);
				position.push(size * box_row + (box_size * (0 + k)), box_size);
				position.push(size * box_row + (box_size * (1 + k)), 0);
				
				position.push(size * box_row + (box_size * (1 + k)), 0);
				position.push(size * box_row + (box_size * (0 + k)), box_size);
				position.push(size * box_row + (box_size * (1 + k)), box_size);
				
				var tetrimono_color = this.hexToRgb(box[1]);

				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
			}
		}
		
		for(var k = 0; k < box[0][1].length; k++){
			if(box[0][1][k] == 1){
				position.push(size * box_row + (box_size * (0 + k)), 0);
				position.push(size * box_row + (box_size * (0 + k)), -box_size);
				position.push(size * box_row + (box_size * (1 + k)), 0);

				position.push(size * box_row + (box_size * (1 + k)), 0);
				position.push(size * box_row + (box_size * (0 + k)), -box_size);
				position.push(size * box_row + (box_size * (1 + k)), -box_size);
			
				var tetrimono_color = this.hexToRgb(box[1]);
			
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
				color.push(tetrimono_color[0], tetrimono_color[1], tetrimono_color[2]);
			
			}
		}

		return [position, color];
	}

	hexToRgb(hex){
		hex = hex.replace('#','');
		var bigint = parseInt(hex, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;
		return [r/255,g/255,b/255];
	}

	// Mouse Tetrimino Kutusunda mı
	mouse_is_box(mouse, box){
		if(
			mouse.x > box.p1 && mouse.x < box.p2 &&
			mouse.y > box.p3 && mouse.y < box.p4
		){
			return true;
		}else{
			return false;
		}
	}

    // Tetrimino tahtada seçilen kare
	AutoColorSelect(){
		for(var y = 0; y < puzzle.board.length; y++){
			for(var x = 0; x < puzzle.board.length; x++){
				var board_index = ((y*puzzle.board.length)+x);
				if(puzzle.board[y][x] == 1){
					for(var i = 18*board_index; i <= 18*board_index+17; i++){ OBjColor[i] = 0.3; } // black
				}else{
					for(var i = 18*board_index; i <= 18*board_index+17; i++){ OBjColor[i] = 1.0; } // white
				}
			}
		}	
	}

    // Tetrimino'yu tahtadan kaldırma

    // Tetrimino'yu aşağı hareket ettirme

    // Tetrimino'yu sola hareket ettirme

    // Tetrimino'yu sağa hareket ettirme

    // Tetrimino'yu döndürme

    // Matrisi saat yönünde döndürme

    // Tetrimino'nun geçerli bir hareket olup olmadığını kontrol etme

}
