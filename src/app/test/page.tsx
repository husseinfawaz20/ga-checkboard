"use client";
import React, { useEffect, useState } from "react";

const Test = () => {
  const [checkBoardSize, setCheckBoardSize] = useState<number>(5);
  const [colorNumber, setColorNumber] = useState<number>(5);
  const [initialPopulation, setinitialPopulation] = useState<any[]>([]);
  const [ancestorMatrix, setAncestorMatrix] = useState<any>();

  const populationSize = 20;

  //   const getData = (checkBoardSize: any, colorNumber: any) => {
  //     checkBoardSize = checkBoardSize;
  //     colorNumber = colorNumber;
  //   };

  const ancestorInitialization = () => {
    let i, j;
    i = 0;
    j = 0;
    let ancestor: number[][] = [];
    let colorIndex = 0;
    let addedColor = 0;

    let colorRepetition = (checkBoardSize * checkBoardSize) / colorNumber;
    if ((checkBoardSize * checkBoardSize) % colorNumber === 0) {
      for (let i = 0; i < checkBoardSize; i++) {
        ancestor[i] = [];
        for (let j = 0; j < checkBoardSize; j++) {
          ancestor[i][j] = colorIndex;
          addedColor++;
          if (addedColor === colorRepetition) {
            colorIndex++;
            addedColor = 0;
          }
        }
      }
      console.log(ancestor);

      generateInitialPopulation(ancestor);
      setAncestorMatrix(ancestor);
    } else {
      console.log("Bad Matrix Formating");
    }
  };

  const generateInitialPopulation = (ancestor:any) => {
    for (let index = 0; index < populationSize; index++) {
      initialPopulation.push(getRandomcheckBoard(ancestor));
      console.log("initialPopulation" + index, initialPopulation[index]);
    }
  };


  const getRandomcheckBoard = (ancestorMatrix: any) => {
    //clone encestor
    let checkBoard = ancestorMatrix?.map((row: any) => row.slice());

    // shuffle the checkBoard boxes
    for (let i = checkBoard?.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [checkBoard[i], checkBoard[j]] = [checkBoard[j], checkBoard[i]];
    }

    for (let index = 0; index < 20 * checkBoardSize; index++) {
      let i1 = Math.floor(Math.random() * checkBoardSize);
      let i2 = Math.floor(Math.random() * checkBoardSize);
      let j1 = Math.floor(Math.random() * checkBoardSize);
      let j2 = Math.floor(Math.random() * checkBoardSize);
      let temp = checkBoard[i1][j1];
      checkBoard[i1][j1] = checkBoard[i2][j2];
      checkBoard[i2][j2] = temp;
    }
    console.log("getRandomcheckBoard", checkBoard);
    console.log("fitness function =", getFitness(checkBoard));

    return checkBoard;
  };

  const getFitness = (checkBoard: any) => {
    let neighborNumber = 0;
    for (let i = 0; i < checkBoardSize; i++) {
      for (let j = 0; j < checkBoardSize; j++) {
        if (j != checkBoardSize - 1) {
          if (checkBoard[i][j] === checkBoard[i][j+1]) {
            neighborNumber++;
          }
        }
        if (i != checkBoardSize - 1) {
          if (checkBoard[i][j] === checkBoard[i+1][j]) {
            neighborNumber++;
          }
        }
      }
    }
    return neighborNumber;
  };

  const GA = () => {
    ancestorInitialization();
  };
  useEffect(() => {
    GA();
  }, []);

  return <div>page</div>;
};

export default Test;
