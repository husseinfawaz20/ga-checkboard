class project {

    checkBoardSize;
    colorNumber;
    initialPopulation = new Array();
    populationSize = 20;
    ancestorMatrix: Number[][];

    getData(checkBoardSize, colorNumber) {
        this.checkBoardSize = checkBoardSize;
        this.colorNumber = colorNumber;
    }

    ancestorInitialization() {
        let i, j;
        i = 0;
        j = 0;
        let colorRepetition=this.checkBoardSize * this.checkBoardSize / this.colorNumber;
        if (this.checkBoardSize * this.checkBoardSize % this.colorNumber === 0) {
            for (let index = 0; index < this.colorNumber; index++) {
                for(let index2=0;index2<colorRepetition;index2++)
                {
                    this.ancestorMatrix[i][j] = index;
                    if (i != this.checkBoardSize - 1) {
                        i++;
                    }
                    else {
                        j++;
                        i=0;
                    }
                }
            }
        }
        else {
            console.log("Bad Matrix Formating");
        }
    }

    generateInitialPopulation() {
        for (let index = 0; index < this.populationSize; index++) {
            this.initialPopulation.push(this.getRandomcheckBoard());
        }
    }

    getRandomcheckBoard() {
        //clone encestor
        let checkBoard = this.ancestorMatrix.map(row => row.slice());

        // shuffle the checkBoard boxes 
        for (let i = checkBoard.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [checkBoard[i], checkBoard[j]] = [checkBoard[j], checkBoard[i]];
        }
        return checkBoard;
    }

    getFitness(checkBoard) {
        let neighborNumber = 0;
        for (let i = 0; i < this.checkBoardSize; i++) {
            for (let j = 0; j < this.checkBoardSize; j++) {
                if (i != this.checkBoardSize - 1) {
                    if (checkBoard[i][j] == checkBoard[i + 1][j]) {
                        neighborNumber++;
                    }
                }
                if (j != this.checkBoardSize - 1) {
                    if (checkBoard[i][j] == checkBoard[i][j + 1]) {
                        neighborNumber++;
                    }
                }
            }
        }
    }

}