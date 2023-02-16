"use client";
import { Box, Button, Grid, Table, TableBody, TableCell, TableRow, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const GA = () => {
  const [checkBoardSize, setCheckBoardSize] = useState<number>(0);
  const [colorNumber, setColorNumber] = useState<number>(0);
  const [initialPopulation, setinitialPopulation] = useState<any[]>([]);
  const [ancestorMatrix, setAncestorMatrix] = useState<any>();
  const [show, setShow] = useState<boolean>(true);
  const populationSize = 1;

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
      // console.log("initialPopulation" + index, initialPopulation[index]);
    }
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

  // useEffect(() => {
  //   ancestorInitialization();
  //   // console.log("ancestorMatrix", initialPopulation);
  // }, []);

  useEffect(() => {}, [show]);

  const handleStart = () => {
    ancestorInitialization();
  };

  const handleSolve = () => {
    setShow(!show);
    generateInitialPopulation(ancestorMatrix);
  };

  const changeColor = (value: any) => {
    setColorNumber(value);
    setAncestorMatrix(null);
    setinitialPopulation([]);
  };
  const changeDimension = (value: any) => {
    setCheckBoardSize(value);
    setAncestorMatrix(null);
    setinitialPopulation([]);
  };
  return (
    <div>
      <TextField label="Colors" variant="outlined" onChange={(e) => changeColor(e.target.value)} />
      <TextField label="Dimension (nxn)" variant="outlined" onChange={(e) => changeDimension(e.target.value)} />

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" onClick={handleStart}>
        Generate
      </Button>

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" onClick={handleSolve}>
        Next Iteration
      </Button>
      {initialPopulation.length > 0 ? (
        <Table>
          <TableBody>
            <Grid container sx={{ justifyContent: "space-between" }}>
              {initialPopulation?.map((item, index) => (
                <Grid item md={4} key={index} sx={{ padding: 5 }}>
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
