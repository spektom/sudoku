(function($) {
	var ID = "sudoku-desk";
	
	var addStyles = function(id) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '#' + id + ' { border-collapse: collapse; }\n'
			+ '#' + id + ' td { border: 1px solid #666; padding: 0; }\n'
			+ '#' + id + ' td div { border-width: 2px; border-style: solid; padding: 16px; width: 16px; height: 16px; text-align: center; font-weight: bold; font-family: Tahoma, sans-serif; font-size: 16px; }\n'
			+ '#' + id + ' td.r div { border-color: #fff; }\n'
			+ '#' + id + ' td.s div { border-color: blue; }\n'
			+ '#' + id + ' td:nth-child(-3n+6) { border-right: 2px solid #222; }\n'
			+ '#' + id + ' tr:nth-child(-3n+6) td { border-bottom: 2px solid #222; }\n';
		document.getElementsByTagName('head')[0].appendChild(style);
	};
	
	var getNumber = function(val) {
		var num = 0;
		if (typeof(val) == 'string') {
			num = parseInt(val);
		} else if (typeof(val) == 'number') {
			num = val;
		}
		if (!isNaN(num) && num > 0 && num < 10) {
			return num;
		}
		return;
	};

	function Desk(id) {
		this.id = id || ID;
	}
	
	Desk.prototype._getCell = function(row, col) {
		return this.table.rows[row].cells[col];
	};
	
	Desk.prototype.select = function(row, col) {
		if (this.selected) {
			this.selected.className = "r";
		}
		this.selected = this._getCell(row, col);
		this.selected.className = "s";
	};
	
	Desk.prototype.set = function(row, col, num) {
		num = getNumber(num);
		if (typeof(num) != 'undefined') {
			this._getCell(row, col).firstChild.textContent = new String(num);
		}
	};

	Desk.prototype.clear = function(row, col) {
		this._getCell(row, col).firstChild.textContent = '';
	};
	
	Desk.prototype.get = function(row, col) {
		return getNumber(this._getCell(row, col).firstChild.textContent);
	};
	
	Desk.prototype.draw = function(parent) {
		addStyles(this.id);

		this.table = document.createElement("table");
		this.table.id = this.id;
		var self = this;
		for (var row = 0; row < $.SIZE; ++row) {
			var tableRow = this.table.insertRow(row);
			for (var col = 0; col < $.SIZE; ++col) {
				var tableCell = tableRow.insertCell(col);
				tableCell.className = "r";
				tableCell.appendChild(document.createElement("div"));
				tableCell.onclick = (function(row, col) {
					return function() {
						self.select(row, col);
					};
				})(row, col);
			}
		}
		parent.appendChild(this.table);
		
		document.onkeydown = function(event) {
			var keyCode = window.event ? window.event.keyCode : event.keyCode;
			var col = self.selected.cellIndex;
			var row = self.selected.parentNode.rowIndex;
			switch (keyCode) {
			case 37: // left
				if (col > 0) {
					self.select(row, col - 1);
				}
				break;
			case 38: // top
				if (row > 0) {
					self.select(row - 1, col);
				}
				break;
			case 39: // right
				if (col < $.SIZE - 1) {
					self.select(row, col + 1);
				}
				break;
			case 40: // bottom
				if (row < $.SIZE - 1) {
					self.select(row + 1, col);
				}
				break;
			case 46: // delete
				self.clear(row, col);
				break;
			default:
				var keyChar = String.fromCharCode(keyCode);
				var num = parseInt(keyChar);
				if (!isNaN(num) && num > 0 && num < 10) {
					self.set(row, col, keyChar);
				}
			}
		};
		this.select(0, 0);
	};
	
	Desk.prototype.toArray = function() {
		var matrix = [];
		for (var row = 0; row < $.SIZE; ++row) {
			for (var col = 0; col < $.SIZE; ++col) {
				if (typeof(matrix[row]) == 'undefined') {
					matrix[row] = [];
				}
				matrix[row][col] = this.get(row, col);
			}
		}
		return matrix;
	};
	
	Desk.prototype.fill = function(matrix) {
		for (var row = 0; row < $.SIZE; ++row) {
			for (var col = 0; col < $.SIZE; ++col) {
				if (typeof(matrix[row][col]) != 'undefined') {
					this.set(row, col, matrix[row][col]);
				}
			}
		}
	};
	
	$.ui = {
		Desk: Desk
	};
})(Sudoku);