class Cell{
    constructor(cell_number, conteiner){
        this.color_player_none = "rgb(0, 128, 0)";
        this.color_player_one = "rgb(128, 128, 128)";
        this.color_player_two = "rgb(0, 0, 0)";
        this.player = 0;
        this.element = $(`<div class="cell" id="cell_${cell_number}"></div>`);
        $(conteiner).append(this.element);
        this.setStyle();
    };
    setPlayerNone(){
        this.player = 0;
        this.element.css("background-color", this.color_player_none);
    };
    setPlayerOne(){
        this.player = 1;
        this.element.css("background-color", this.color_player_one);
    };
    setPlayerTwo(){
        this.player = 2;
        this.element.css("background-color", this.color_player_two);
    };
    setStyle(){
        this.element.css("background-color", this.color_player_none);
        this.element.width("200px");
        this.element.height("200px");
        this.element.css("margin","3px");
    };
    reset(){
        this.player = 0;
        this.setStyle();
    }
    setCliskFunc(func, field){
        let cell = this;
        this.element.click(function () {
            func(cell, field);
        });
    }
    getDom(){
        return this.element[0].outerHTML;
    };
}

class Line{
    constructor(line_number, line_length, conteiner){
        this.element = $(`<div class="line" id="line_${line_number}"></div>`)
        conteiner.append(this.element);
        this.cells = Array(line_length).fill().map((e, index) => new Cell(line_number * line_length + index, this.element));
        this.setStyle();
    };
    setStyle(){
        this.element.css("display","flex");
    };
    getDom(){
        return this.element[0].outerHTML;
    };
}

class Reset{
    constructor(conteiner){
        this.element = $(`<div class="reset" id="reset">Reset</div>`);
        conteiner.append(this.element);
        this.setStyle();
    }
    setStyle(){
        this.element.css("height","50px");
        this.element.css("width","150px");
        this.element.css("background-color","red");
    };
    reset(){
        this.setStyle();
    }
    setCliskFunc(func, field){
        this.element.click(function () {
            func(field);
        });
    }
    getDom(){
        return this.element[0].outerHTML;
    };
}

class Field{
    constructor(line_length, conteiner){
        this.player_turn = 1;
        this.element = $(`<div id="field"></div>`);
        conteiner.append(this.element);
        this.lines = Array(line_length).fill().map((e, index) => new Line(index, line_length, this.element));
        this.resetButton = new Reset(this.element);
        this.setStyle();
    }
    setStyle(){
        let _field = this;
        this.lines.forEach((item, index, array) => {
            item.cells.forEach((item, index, array) => {
                item.setCliskFunc(this.clickPlayerOnCell, this);
            })
        });
        this.resetButton.setCliskFunc(this.reset, this);
    };
    clickPlayerOnCell(cell, field) {
        if(cell.player === 0){
            if(field.player_turn === 1){
                cell.setPlayerOne();
            }else if(field.player_turn === 2){
                cell.setPlayerTwo();
            }
    
            if (field.checkWin()){
                field.win();
                field.reset();
            } else {
                field.transferMove();
            }
        }
    }
    transferMove(){
        if (this.player_turn === 1){
            this.player_turn = 2;
        } else {
            this.player_turn = 1;
        }
    }
    reset(field){
        field.lines.forEach((line) => line.cells.forEach((cell) => cell.reset()));
        field.resetButton.reset();
    };
    checkWin(){
        if (this.lines.some((line) => line.cells.every((cell) => cell.player === this.player_turn))){
            return true;
            console.log("HI");
        }

        let rows = this.lines.map((line, index) => this.lines.map((line) => line.cells[index]));
        if (rows.some((row) => row.every((cell) => cell.player === this.player_turn))){
            return true;
        }

        if(this.lines.every((line, index) => this.lines[index].cells[index].player === this.player_turn)){
            return true;
        }

        if(this.lines.every((line, index) => this.lines[this.lines.length - 1 - index].cells[index].player === this.player_turn)){
            return true;
        }

        return false;
    };
    win(){
        alert("win player " + this.player_turn);
    };
}

let field = new Field(3, $('body'));