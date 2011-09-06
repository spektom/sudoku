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
	
	var processDependent = function(matrix, row, col, func) {
		for (var r = 0; r < $.SIZE; ++r) {
			if (r != row) {
				func(r, col);
			}
		}
		for (var c = 0; c < $.SIZE; ++c) {
			if (c != col) {
				func(row, c);
			}
		}
		var startRow = row - (row % 3);
		var startCol = col - (col % 3);
		for (var r = startRow; r < startRow + 3; ++r) {
			for (var c = startCol; c < startCol + 3; ++c) {
				if (r != row && c != col) {
					func(r, c);
				}
			}
		}
	};
	
	var collectConstraints = function(matrix, row, col) {
		var constraints = [];
		processDependent(matrix, row, col, function(r, c) {
			if (typeof(matrix[r][c]) != 'undefined') {
				constraints[matrix[r][c]] = true;
			}
		});
		return constraints;
	};
	
	var getAllowed = function(matrix, row, col) {
		var constraints = collectConstraints(matrix, row, col);
		var allowed = [];
		for (var num = 1; num <= $.SIZE; ++num) {
			if (typeof(constraints[num]) == 'undefined') {
				allowed[num] = true;
			}
		}
		return allowed;
	};
	
	var generateGuesses = function(matrix) {
		var guesses = [];
		for (var row = 0; row < $.SIZE; ++row) {
			for (var col = 0; col < $.SIZE; ++col) {
				if (typeof(matrix[row][col]) == 'undefined') {
					if (typeof(guesses[row]) == 'undefined') {
						guesses[row] = [];
					}
					guesses[row][col] = getAllowed(matrix, row, col);
				}
			}
		}
		return guesses;
	};
	
	var processGuesses = function(matrix, guesses) {
		var processed;
		do {
			processed = false;
			for (var rowKey in guesses) {
				for (var colKey in guesses[rowKey]) {
					var cellGuesses = guesses[rowKey][colKey];
					var keys = getKeys(cellGuesses);
					if (keys.length == 1) {
						var num = keys.pop();
						processDependent(matrix, rowKey, colKey, function(r, c) {
							if (typeof(guesses[r][c]) != 'undefined') {
								delete guesses[r][c][num];
							} 
						});
						processed = true;
						matrix[rowKey][colKey] = num;
						delete guesses[rowKey][colKey];
					}
				}
			}
		} while (processed);
	};
	
	$.core = {
		solve: function(matrix) {
			var guesses = generateGuesses(matrix);
			processGuesses(matrix, guesses);
			return matrix;
		}
	};
})(Sudoku);
