var Sudoku = {
	SIZE: 9
};

(function($){
	var getKeys = function(array) {
		var keys = [];
		for (var key in array) {
			keys.push(key);
		}
		return keys;
	};
	
	var collectConstraints = function(matrix, row, col) {
		var constraints = [];
		for (var r = 0; r < $.SIZE; ++r) {
			if (r != row) {
				if (typeof(matrix[r][col]) != 'undefined') {
					constraints[matrix[r][col]] = true;
				}
			}
		}
		for (var c = 0; c < $.SIZE; ++c) {
			if (c != col) {
				if (typeof(matrix[row][c]) != 'undefined') {
					constraints[matrix[row][c]] = true;
				}
			}
		}
		var startRow = row - (row % 3);
		var startCol = col - (col % 3);
		for (var r = startRow; r < startRow + 3; ++r) {
			for (var c = startCol; c < startCol + 3; ++c) {
				if (r != row && c != col && typeof(matrix[r][c]) != 'undefined') {
					constraints[matrix[r][c]] = true;
				}
			}
		}
		return constraints;
	};
	
	var getAllowed = function(matrix, row, col) {
		var allowed = [];
		var constraints = collectConstraints(matrix, row, col);
		for (var num = 1; num <= $.SIZE; ++num) {
			if (typeof(constraints[num]) == 'undefined') {
				allowed.push(num);
			}
		}
		return allowed;
	};
	
	var fillGuessesMatrix = function(matrix) {
		var guessesMatrix = [];
		for (var row = 0; row < $.SIZE; ++row) {
			for (var col = 0; col < $.SIZE; ++col) {
				if (typeof(matrix[row][col]) == 'undefined') {
					if (typeof(guessesMatrix[row]) == 'undefined') {
						guessesMatrix[row] = [];
					}
					guessesMatrix[row][col] = getAllowed(matrix, row, col);
				}
			}
		}
		return guessesMatrix;
	};
	
	$.core = {
		solve: function(matrix) {
			window.guessMatrix = fillGuessesMatrix(matrix);
			return matrix;
		}
	};
})(Sudoku);
