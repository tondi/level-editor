function Ui() {
    this.tableSize = 18; // Niepotrzebnie (?) osobne x, y => always square
    this.code = document.getElementById("container__json__code");
    
    var select = document.getElementById("container__center__select");
    var load = document.getElementById("load");
    var tableCont = document.getElementById("container__div")
    var table = document.getElementById("container__div__table");
    var buttons = document.getElementsByClassName("selectBt");
    var activeTypeBt = document.getElementById("wallBt");
    var stylesheet = document.styleSheets[0];
    var activeBg = getComputedStyle(activeTypeBt).backgroundColor;

    (function initBt() {
        activeTypeBt.classList.add("activeTypeBt")
        stylesheet.insertRule(`.container__div__table__cell:hover{background-color: ${activeBg};}`, 0);
        activeBg = getComputedStyle(activeTypeBt).backgroundColor
    }())

    for(let value of buttons) {
        //console.log(value)
        value.addEventListener("click", () => {
            //console.log(value)

            activeTypeBt.className = "";
            value.className = "activeTypeBt";
            activeTypeBt = value;

            activeBg = getComputedStyle(activeTypeBt).backgroundColor
            //console.log(activeBg)

            stylesheet.deleteRule(0) // Its possible because we have one rule and add on [0] index
            stylesheet.insertRule(`.container__div__table__cell:hover{background-color: ${activeBg};}`, 0);
            //console.log(stylesheet)

        })
    }


	(function createSelect (size) {
		for(let i = 1; i <= size; i++){
			//console.log(option_)
			var option_ = document.createElement("option")
			option_.value = i;
			option_.innerHTML = i;

			if(i === 18){
				option_.selected = "selected";
			}

			select.appendChild(option_)
		}
		
		
	}(20))

    var createTable = (tableSize) => {
        //console.log(tableCont)

        //table.id = "table"
        //if (table.hasChildNodes) {
        //    table.removeChild(childNodes)
        //}
        table.innerHTML = ""

        for (var x = 0; x < tableSize; x++) {
            var row = document.createElement("tr");

            for (var y = 0; y < tableSize; y++) {
                var cell = document.createElement("td");
                cell.id = "p" + (y > 9 ? y : "0" + y ) + (x > 9 ? x : "0" + x);
                cell.className = "container__div__table__cell"
                //cell.style.width = screen.width / 4 / tableSize + "px";
                //cell.style.height = cell.style.width;
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
        this.tableSize = tableSize;

    }
    createTable(this.tableSize)


	var prevHoveredX;
	var prevHoveredY;

	//var prevClickedX;
	//var prevClickedY;

	
	function clicked(e) {
		var curr = e.target || e.srcElement;

		var xObj = curr.id.slice(1, 3)
		var yObj = curr.id.slice(3, 5)

		//console.log(curr.id);
		if(curr.id[0] !== "p") {
			table.removeEventListener("mousemove", clicked);
			return;
		}
			

		if(prevHoveredX !== xObj || prevHoveredY !== yObj){
			console.log(xObj, yObj, activeTypeBt.value);
			// map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value ); // send only x, always square
            if(activeTypeBt.value == 'delete') {
                map.removeBlock(xObj, yObj);
            } else {
                map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value ); // send only x, always square
            }

			prevHoveredX = xObj;
			prevHoveredY = yObj;
		}
	}

	function single(e) {
	    var curr = e.target || e.srcElement;
	    var xObj = curr.id.slice(1, 3)
	    var yObj = curr.id.slice(3, 5)

	    // map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value); // send only x, always square
        if(activeTypeBt.value == 'delete') {
            map.removeBlock(xObj, yObj);
        } else {
            map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value ); // send only x, always square
        }

	    if (prevClickedX !== xObj || prevClickedY !== yObj) {
	        //console.log(xObj, yObj)
            if(activeTypeBt.value == 'delete') {
                map.removeBlock(xObj, yObj);
            } else {
                map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value ); // send only x, always square
            }
            // map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value); // send only x, always square

	        prevClickedX = xObj;
	        prevClickedY = yObj;
	    }

	    table.removeEventListener("mousemove", clicked);
	    
	}

	var tableListeners = (tableSize) => {
        // Pojedyncze kliknięcie
        

        // Performance: adds move listener only when actually clicked
		table.addEventListener("mousedown", (e) => {
		    //console.log("down")
		    //table.addEventListener("click", single(e))
		    var curr = e.target || e.srcElement;
		    var xObj = curr.id.slice(1, 3)
		    var yObj = curr.id.slice(3, 5)

            if(activeTypeBt.value == 'delete') {
                map.removeBlock(xObj, yObj);
            } else {
                map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value ); // send only x, always square
            }
		    // map.createJSON(ui.tableSize, xObj, yObj, activeTypeBt.value); // send only x, always square

		    prevHoveredX = xObj;
		    prevHoveredY = yObj;

			table.addEventListener("mousemove", clicked)
		})
		table.addEventListener("mouseup", (e) => {
		    //console.log("up", e)
		    //table.removeEventListener("click", single(e))
		    table.removeEventListener("mousemove", clicked);


		})
		//console.log(prevHovered)
	}
    tableListeners(this.tableSize)

    ///////////////////////// INPUTY ///////////////////////////
    //console.log(select)
    select.addEventListener("change", () => {
		table.removeEventListener("mousemove", clicked);
        console.log(select.value)
        console.log(table)
        map.area.size = select.value;
        ui.appendJSON(map.area)
		this.tableSize = select.value
		createTable(this.tableSize) // Bo plansza kwadratowa
        tableListeners(this.tableSize)
		this.highlightArea(this.code.value)
		//tableListeners(this.size)
    })

    this.appendJSON = (json) => {
		if(typeof json === "string"){
			this.code.value = json;
		}
		if(typeof json === "object"){
			this.code.value = JSON.stringify(json, null, '\t')
		}
        
    }

    this.highlightArea = (json) => {
        
        let finish = JSON.parse(json)
        let toHighlight = [];
        for(let value of finish.level) {
            let xy = {y: value.x, x:value.z, type:value.type}
            toHighlight.push(xy)
        }
        console.log("toHighlight", toHighlight)
        
        for (let x = 0; x < this.tableSize; x++) {
            for (let y = 0; y < this.tableSize; y++) {
                table.childNodes[x].childNodes[y].className = 'container__div__table__cell'
                for(let value of toHighlight){
                    if (value.x == x && value.y == y) {
                        table.childNodes[x].childNodes[y].className = value.type
                        
                    }
                }
            }
        }
    }

    
    load.addEventListener("click", () => {
        var value = this.code.value;
		var valueObj = JSON.parse(value);
		console.log(valueObj)
		createTable(valueObj.size)

        for (let x = 0; x < this.tableSize; x++) {
            for (let y = 0; y < this.tableSize; y++) {
                //console.log(table.childNodes[x].childNodes[y])

                    let curr = table.childNodes[x].childNodes[y]
                    curr.className = "container__div__table__cell"

            }
        }


        //this.area = JSON.parse(code.value)
		map.area = JSON.parse(value)

        this.highlightArea(value)
		select.value = valueObj.size;

    })


}


