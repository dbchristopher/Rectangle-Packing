(function () { 'use strict';

	var grid = new GridLayout();
	grid.init();
	window.onresize = function () {
		grid.init();
	};

	function GridLayout() {
		var WRAPPER = 'gridContainer',
			TOPPAD = 30,
			RIGHTPAD = 15,
			BOTPAD = 15,
			LEFTPAD = 0,
			COLW = 250,
			COLSPAN = 1,
			COL_AR = [];

		this.init = function () {
			if(document.getElementById(WRAPPER)) {
				this.wrapperWidth('auto');
				var itemList = document.getElementsByClassName('element'),
					box = {},
					columnCount = 3; 
				// AT LEAST columnCount COLUMNS
				columnCount = Math.max(((this.getPageW(WRAPPER) - (LEFTPAD * 2) + RIGHTPAD) / (COLW + RIGHTPAD) >>> 0), columnCount);
				if(COL_AR.length !== columnCount && itemList.length > 0) {
					// CREATE ZERO-HEIGHT ARRAY OF COLUMNS
					COL_AR = [];
					for ( var i = 0; i < columnCount; i++ ) {
						COL_AR[i] = {x: i, y: 0};
					}
					// PLACE ITEMS ON GRID
                    var length = itemList.length;
					for (i=0; i < length; i++) {
						box = itemList[i];
						COLSPAN = (box.offsetWidth / COLW) + 0.5 >>> 0;
						if (COLSPAN === 1) {
							// IF BOX IS ONE COLUMN WIDE, PLACE ON THE SHORTEST COLUMN
							COL_AR.sort(this.ySort);
							this.draw(box, COL_AR[0].x, COL_AR[0].y);
						} else {
							// IF BOX IS TWO COLUMNS WIDE, CALCULATE BEST POSITION
							this.placeWide(box);
						}
					}
					COL_AR.sort(this.ySort);
					this.wrapperHeight(COL_AR[columnCount-1].y + BOTPAD);
				}
				this.wrapperWidth(columnCount*(COLW+RIGHTPAD)-RIGHTPAD);
			}
		};

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
		};

		this.draw = function (box, x, y) {
			// POSITION ELEMENTS
			if(box.style.position !== 'absolute') { 
				box.style.position = 'absolute'; 
			}
			box.style.left = x * (COLW + RIGHTPAD) + LEFTPAD + "px";
			box.style.top = y + TOPPAD + "px";
			// UPDATE HEIGHT OF COLUMN(S) USED
			COL_AR.sort(this.xSort);
			for (var i = 0; i < COLSPAN; i++) {
				COL_AR[x + i].y = y + box.offsetHeight + BOTPAD;
			}
		};

		// GET TALLEST COLUMN WITHIN GROUPS OF [COLSPAN]
		this.maxY = function(col) {
			var maxY = 0;
			for (var i = 0; i < COLSPAN; i++) {
				maxY = (COL_AR[col + i].y >= maxY) ? COL_AR[col + i].y : maxY;
			}
			return(maxY);
		};

		// PAGE WIDTH
		this.getPageW = function (parentId) {
			var width;
			// CONTAINING ELEMENT
			if(parentId) {
				var el = document.getElementById(parentId);
				if (el.currentStyle) { width = el.currentStyle.width; }
				else if (window.getComputedStyle) { width = document.defaultView.getComputedStyle(el,null).getPropertyValue('width'); }
			// WINDOW
			} else {
				if (window.self.innerWidth) { width = window.self.innerWidth + 20; }
                                else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth + 20; }
				else if (document.body) { width = document.body.clientWidth + 20; }
			}
			return parseInt(width, 10);
		};

		// SORT BY COLUMN POSITION
		this.xSort = function (a, b) {
			return (a.x - b.x);
		};

		// SORT BY COLUMN HEIGHT
		this.ySort = function (a, b) {
			if (a.y === b.y) { // EQUAL HEIGHT, PRIORITIZE TO THE LEFT
				return (a.x - b.x);
			} else {
				return (a.y - b.y);
			}
		};

		// SORT BY MAX(GROUP OF TWO)
		this.maxSort = function (a, b) {
			if (a.maxY === b.maxY) { return (a.x - b.x); }
			else { return (a.maxY - b.maxY); }
		};

		// SNAP WRAPPER TO GRID width
		this.wrapperWidth = function(width) {
			var wrapper = document.getElementById(WRAPPER);
			if(isNaN( parseInt(width, 10) )) {
				wrapper.style.width = width;
			} else {
				wrapper.style.width = width + 'px';
			}
		};

		// MAKE SURE EVERYTHING BELOW THE CONTENT SHOWS UP BELOW THE CONTENT
		this.wrapperHeight = function(height) {
			var wrapper = document.getElementById(WRAPPER);
			wrapper.style.height = (height) + 'px';
		};
	}
})();