"use client";
import { Alert, Box, Button, Grid, Table, TableBody, TableCell, TableRow, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GA = () => {
  const [checkBoardSize, setCheckBoardSize] = useState<number>(5);
  const [colorNumber, setColorNumber] = useState<number>(5);
  const [initialPopulation, setinitialPopulation] = useState<any[]>([]);
  const [ancestorMatrix, setAncestorMatrix] = useState<any>();
  const [show, setShow] = useState<boolean>(true);
  const [disableGen, setDisableGen] = useState<boolean>(false);
  const [populationSize, setPopulationSize] = useState<number>(0);

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
    let crosseOverPopulation = [];
    for (let i = 0; i < populationSize; i++) {
      crosseOverPopulation.push(initialPopulation[i]);
    }
    // console.log("crosseOverPopulation,", crosseOverPopulation);
    for (let i = 0; i < crosseOverPopulation.length - 1; i++) {
      for (let j = i + 1; j < crosseOverPopulation.length; j++) {
        const checkBoard = coupleCrossOver(crosseOverPopulation[i], crosseOverPopulation[j]);
        const fitness = getFitness(checkBoard);
        initialPopulation.push({ checkBoard, fitness });
      }
    }
    initialPopulation.sort((a, b) => a.fitness - b.fitness);
    if (initialPopulation[0].fitness === 0) toast.success("Solution Found!");
  };

  const coupleCrossOver = (parent1, parent2) => {
    let child = [];
    let parent1CheckBoard: any = JSON.parse(JSON.stringify(parent1));
    let parent2CheckBoard: any = JSON.parse(JSON.stringify(parent2));

    const crossOverPoint = Math.floor(Math.floor(Math.random() * parent1?.checkBoard.length));
    let parent1Chr = parent1CheckBoard?.checkBoard.splice(0, crossOverPoint);
    let parent2Chr = parent2CheckBoard?.checkBoard.splice(crossOverPoint, parent2?.checkBoard.length);
    if (Math.random() > 0.5) {
      const tempParent = parent1Chr;
      parent1Chr = parent2Chr;
      parent2Chr = tempParent;
    }

    // parent Permutation
    if (Math.random() < 0.1) {
      parent1Chr = permutate(parent1Chr);
      parent2Chr = permutate(parent2Chr);
    }

    child = parent1Chr.concat(parent2Chr);

    let colors: number[] = new Array(colorNumber).fill((checkBoardSize * checkBoardSize) / colorNumber);

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
            let secondRound = false;
            for (let index = 0; index < colors.length; index++) {
              if (index != child[i][j] && colors[index] > 0) {
                let neighbors = [];
                if (i != 0) {
                  neighbors.push(child[i - 1][j]);
                }
                if (i != child.length - 1) {
                  neighbors.push(child[i + 1][j]);
                }
                if (j != 0) {
                  neighbors.push(child[i][j - 1]);
                }
                if (j != child[i].length - 1) {
                  neighbors.push(child[i][j + 1]);
                }
                if (neighbors.includes(index) || secondRound) {
                  colors[child[i][j]]++;
                  colors[index]--;
                  child[i][j] = index;
                }
                break;
              }

              if (index == colors.length - 1 && secondRound == false) {
                index = 0;
                secondRound = false;
              }
            }
          }
        }
      }
    }
    return child;
  };

  const permutate = (checkBoard) => {
    for (let i = 0; i < checkBoard.length - 1; i++) {
      for (let j = i + 1; j < checkBoard.length - 1; j++) {
        let temp = checkBoard[i][j];
        checkBoard[i][j] = checkBoard[i + 1][j + 1];
        checkBoard[i + 1][j + 1] = temp;
      }
    }
    return checkBoard;
  };

  const handleStart = () => {
    ancestorInitialization();
    setDisableGen(true);
  };

  const handleCrossover = () => {
    setShow(!show);
    populationCrossOver();
  };

  const handleAutomatedCrossover = () => {
    setShow(!show);
    for (let i = 0; i < 20; i++) {
      populationCrossOver();
      if (initialPopulation[0].fitness === 0) {
        <Alert severity="success">SOLUTION FOUND!!!</Alert>;
      }
    }
  };
  const handleClear = () => {
    setAncestorMatrix(null);
    setinitialPopulation([]);
    setPopulationSize(1);
    setDisableGen(false);
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

  return (
    <div>
      <TextField label="Colors" variant="outlined" onChange={(e) => changeColor(e.target.value)} />
      <TextField label="Dimension (nxn)" variant="outlined" onChange={(e) => changeDimension(e.target.value)} />
      <TextField label="Population" variant="outlined" onChange={(e) => changePopulation(e.target.value)} />

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" onClick={handleStart} disabled={disableGen}>
        Generate
      </Button>

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" color="success" onClick={handleCrossover}>
        Crossover
      </Button>

      <Button
        sx={{ paddingTop: 3, marginLeft: 5 }}
        variant="contained"
        color="success"
        onClick={handleAutomatedCrossover}
      >
        Automated Crossover
      </Button>

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" color="error" onClick={handleClear}>
        Clear All
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
