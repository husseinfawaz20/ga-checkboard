"use client";
import { Box, Button, Grid, Table, TableBody, TableCell, TableRow, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const GA = () => {
  const [checkBoardSize, setCheckBoardSize] = useState<number>(5);
  const [colorNumber, setColorNumber] = useState<number>(5);
  const [initialPopulation, setinitialPopulation] = useState<any[]>([]);
  const [childrenPopulation, setchildrenPopulation] = useState<any[]>([]);
  const [ancestorMatrix, setAncestorMatrix] = useState<any>();
  const [show, setShow] = useState<boolean>(true);
  const [disableGen, setDisableGen] = useState<boolean>(false);
  const [populationSize, setPopulationSize] = useState<number>(1);

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
      // console.log(ancestor);

      generateInitialPopulation(ancestor);
      setAncestorMatrix(ancestor);
    } else {
      console.log("Bad Matrix Formating");
    }
  };

  const generateInitialPopulation = (ancestor: any) => {
    for (let index = 0; index < populationSize; index++) {
      initialPopulation.push(getRandomcheckBoard(ancestor));
    }

    initialPopulation.sort((a, b) => a.fitness - b.fitness);
  };

  const getRandomcheckBoard = (ancestorMatrix: any) => {
    //clone ancestor
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
    const fitness = getFitness(checkBoard);

    return { checkBoard, fitness };
  };

  const getFitness = (checkBoard: any) => {
    let neighborNumber = 0;
    for (let i = 0; i < checkBoardSize; i++) {
      for (let j = 0; j < checkBoardSize; j++) {
        if (j != checkBoardSize - 1) {
          if (checkBoard[i][j] === checkBoard[i][j + 1]) {
            neighborNumber++;
          }
        }
        if (i != checkBoardSize - 1) {
          if (checkBoard[i][j] === checkBoard[i + 1][j]) {
            neighborNumber++;
          }
        }
      }
    }
    return neighborNumber;
  };

  const populationCrossOver = () => {
    var ip = JSON.parse(JSON.stringify(initialPopulation));
    const crosseOverPopulation = ip.slice(0, 2);

    for (let i = 0; i < crosseOverPopulation.length - 1; i++) {
      for (let j = i + 1; j < crosseOverPopulation.length; j++) {
        const checkBoard = coupleCrossOver(crosseOverPopulation[i], crosseOverPopulation[j]);
        const fitness = getFitness(checkBoard);
        initialPopulation.push({ checkBoard, fitness });
        childrenPopulation.push({ checkBoard, fitness });
      }
    }
    initialPopulation.sort((a, b) => a.fitness - b.fitness);
  };

  function normalizeMatrix(matrix: number[][]): number[][] {
    const counts: { [key: number]: number } = {};
    let maxCount = 0;

    // Step 1: Count the number of occurrences of each value
    for (const row of matrix) {
      for (const value of row) {
        counts[value] = (counts[value] ?? 0) + 1;
        maxCount = Math.max(maxCount, counts[value]);
      }
    }

    // Step 2: Modify the matrix to ensure each value occurs exactly maxCount times
    const newMatrix: number[][] = Array.from({ length: matrix.length }, () => []);
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[0].length; col++) {
        const value = matrix[row][col];
        newMatrix[row][col] = value;

        // Step 4: Replace values that occur less than maxCount times
        if (counts[value] < maxCount) {
          const diff = maxCount - counts[value];
          for (let i = 0; i < diff; i++) {
            let newRow: number, newCol: number;
            do {
              newRow = Math.floor(Math.random() * matrix.length);
              newCol = Math.floor(Math.random() * matrix[0].length);
            } while (newMatrix[newRow][newCol] === value);
            newMatrix[newRow][newCol] = value;
          }
        }
      }
    }

    return newMatrix;
  }

  const coupleCrossOver = (parent1, parent2) => {
    let child = [];
    const midpoint = Math.floor(parent1?.checkBoard.length / 2);
    const parent1Chr = parent1?.checkBoard.splice(0, midpoint);
    const parent2Chr = parent2?.checkBoard.splice(midpoint, parent2?.checkBoard.length);
    child = parent1Chr.concat(parent2Chr);

    let colors: number[] = new Array(colorNumber).fill((checkBoardSize * checkBoardSize) / colorNumber);
    function count(array) {
      return array
        .flat()
        .join(" ")
        .split(" ")
        .reduce((acc, word) => {
          acc[word] = acc[word] !== undefined ? acc[word] + 1 : 1;
          return acc;
        }, {});
    }

    const color = count(child);

    for (let i = 0; i < checkBoardSize; i++)
      for (let j = 0; j < checkBoardSize; j++) {
        colors[child[i][j]]--;
      }

    let goodformat = true;
    for (let i = 0; i < colors.length; i++) {
      if (colors[i] != 0) {
        goodformat = false;
        break;
      }
    }
    if (!goodformat) {
      for (let i = 0; i < child.length; i++) {
        for (let j = 0; j < child[i].length; j++) {
          if (colors[child[i][j!]] < 0) {
            for (let index = 0; index < colors.length; index++) {
              const ind = j;
              console.log("child i j", child[i][ind!], i, j, child);
              if (index != child[i][ind!] && colors[index] > 0) {
                colors[child[i][ind!]]++;
                colors[index]--;
                child[i][ind] = index;
                break;
              }
            }
          }
        }
      }
    }
    return child;
  };

  const handleStart = () => {
    ancestorInitialization();
    setDisableGen(true);
  };

  const handleSolve = () => {
    setShow(!show);
    generateInitialPopulation(ancestorMatrix);
  };

  const changeColor = (value: any) => {
    setColorNumber(value);
    setAncestorMatrix(null);
    setinitialPopulation([]);
    setDisableGen(false);
  };
  const changeDimension = (value: any) => {
    setCheckBoardSize(value);
    setAncestorMatrix(null);
    setinitialPopulation([]);
    setDisableGen(false);
  };

  const changePopulation = (value: any) => {
    setPopulationSize(value);
    setAncestorMatrix(null);
    setinitialPopulation([]);
    setDisableGen(false);
  };

  const handleCrossover = () => {
    populationCrossOver();
  };

  return (
    <div>
      <TextField label="Colors" variant="outlined" onChange={(e) => changeColor(e.target.value)} />
      <TextField label="Dimension (nxn)" variant="outlined" onChange={(e) => changeDimension(e.target.value)} />
      <TextField label="Population" variant="outlined" onChange={(e) => changePopulation(e.target.value)} />

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" onClick={handleStart} disabled={disableGen}>
        Generate
      </Button>

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" onClick={handleSolve}>
        Next Iteration
      </Button>

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" onClick={handleCrossover}>
        Crossover
      </Button>

      {initialPopulation.length > 0 ? (
        <Table>
          <TableBody>
            <Grid container>
              {initialPopulation?.map((item, index) => (
                <Grid item md={checkBoardSize > 5 ? 5 : 3} key={index} sx={{ padding: 3 }}>
                  {item?.checkBoard?.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((color, j) => {
                        return (
                          <TableCell
                            key={j}
                            style={{
                              backgroundColor: `hsl(${color * 60}, 100%, 50%)`,
                              borderColor: "white",
                              borderStyle: "solid",
                              borderWidth: "0.2em",
                            }}
                          >
                            <Box
                              sx={{
                                width: 35,
                                height: 35,
                              }}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                  <TextField
                    label="Fitness Function:"
                    variant="filled"
                    sx={{ width: 188, paddingTop: 4 }}
                    value={item.fitness}
                  />
                </Grid>
              ))}
            </Grid>
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
};

export default GA;
