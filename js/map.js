function Map() {
    if (ui.flagLoaded) {
        this.area = JSON.parse(code.value)
    } else {
        this.area = {};
        this.area.level = [];
        var id = 1;
    } // NIepotrzebne serio


    this.createJSON = function (size, x, z, type) { // 'z' because of THREE axis
        //console.log(arguments)
        this.area.size = size;

        var blockInfo = {
            id: id,
            x: x,
            z: z,
            type: type
        }

        //console.log(this.area.level)
        //this.area.level.push("abc")
        this.area.level.push(blockInfo)
        var jsonMap = JSON.stringify(this.area, null, '\t')

        ui.appendJSON(jsonMap)
        ui.highlightArea(jsonMap)
        //console.log(jsonMap)
        //this.area.x = x;
        //this.area.z = z;

        id++;

        //console.log(this.area)
    }

}