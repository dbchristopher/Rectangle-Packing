(function () {

	var grid = new GridLayout();
	grid.init();
	window.onresize = function () {
		grid.init();
	}

	function GridLayout() {
		var RIGHTPAD = 30,
			TOPPAD = 60,
			LEFTPAD = 30,
			BOTPAD = 30,
			COLW = 220,
			COLSPAN = 1,
			COL_AR = [];

		this.init = function () {
			var itemList = document.getElementsByClassName('element'),
				box = {},
				columnCount = 3; // AT LEAST columnCount COLUMNS
			columnCount = Math.max(((this.getPageW() - (LEFTPAD * 2)) / (COLW + RIGHTPAD) >>> 0), columnCount);
			if(COL_AR.length !== columnCount) {
				// CREATE ZERO-HEIGHT ARRAY OF COLUMNS
				COL_AR = [];
				for ( var i = 0; i < columnCount; i++ ) {
					COL_AR[i] = {x: i, y: 0};
				}
				// PLACE ITEMS ON GRID
				for (var i=0, length = itemList.length; i < length; i++) {
					box = itemList[i];
					COLSPAN = (box.offsetWidth / COLW) + .5 >>> 0;
					if (COLSPAN === 1) {
						// IF BOX IS ONE COLUMN WIDE, PLACE ON THE SHORTEST COLUMN
						COL_AR.sort(this.ySort);
						this.draw(box, COL_AR[0].x, COL_AR[0].y);
					} else {
						// IF BOX IS TWO COLUMNS WIDE, CALCULATE BEST POSITION
						this.placeWide(box);
					}
				}
			}
		}

		// FIND SHORTEST (GROUP OF TWO) COLUMNS
		this.placeWide = function (box) {
			var tmp_col = COL_AR.sort(this.xSort),
				remainder = COL_AR.length - COLSPAN,
				maxY = 0,
				diff = 0,
				i = 0;
			while( remainder-- >= 0 ) {
				tmp_col[i].maxY = this.maxY(i);
				tmp_col[i].diff = Math.abs(tmp_col[i].y - tmp_col[i].maxY);
				i++;
			}
			tmp_col.sort(this.maxSort);
			tmp_col[0].y += tmp_col[0].diff;
			this.draw(box, tmp_col[0].x, tmp_col[0].y);
		}

		this.draw = function (box, x, y) {
			// POSITION ELEMENTS
			box.style.left = x * (COLW + RIGHTPAD) + LEFTPAD + "px";
			box.style.top = y + TOPPAD + "px";
			// UPDATE HEIGHT OF COLUMN(S) USED
			COL_AR.sort(this.xSort);
			for (var i = 0; i < COLSPAN; i++) {
				COL_AR[x + i].y = y + box.offsetHeight + BOTPAD;
			}
		}

		// GET TALLEST COLUMN WITHIN GROUPS OF [COLSPAN]
		this.maxY = function(col) {
			var maxY = 0;
			for (var i = 0; i < COLSPAN; i++) {
				maxY = (COL_AR[col + i].y >= maxY) ? COL_AR[col + i].y : maxY;
			}
			return(maxY);
		}

		// PAGE WIDTH
		this.getPageW = function () {
			var width;
			if (window.self.innerWidth) width = window.self.innerWidth + 20;
			else if (document.documentElement && document.documentElement.clientWidth) width = document.documentElement.clientWidth + 20;
			else if (document.body) width = document.body.clientWidth + 20;
			return width;
		}

		// SORT BY COLUMN POSITION
		this.xSort = function (a, b) {
			return (a.x - b.x);
		}

		// SORT BY COLUMN HEIGHT
		this.ySort = function (a, b) {
			if (a.y == b.y) {
				return (a.x - b.x);
			} else {
				return (a.y - b.y);
			}
		}

		// SORT BY MAX(GROUP OF TWO)
		this.maxSort = function (a, b) {
			if (a.maxY == b.maxY) return (a.x - b.x);
			else return (a.maxY - b.maxY);
		}
	}
})();