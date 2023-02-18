"use client";
import { Box, Button, Grid, Table, TableBody, TableCell, TableRow, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const GA = () => {
  const [checkBoardSize, setCheckBoardSize] = useState<number>(0);
  const [colorNumber, setColorNumber] = useState<number>(0);
  const [initialPopulation, setinitialPopulation] = useState<any[]>([]);
  const [ancestorMatrix, setAncestorMatrix] = useState<any>();
  const [show, setShow] = useState<boolean>(true);
  const [disableGen, setDisableGen] = useState<boolean>(false);

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

    //sort the population desc by fitness
    initialPopulation.sort((a,b) => b.fitness-a.fitness);
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


  const populationCrosseOver=()=>{
    let crosseOverPopulation =initialPopulation.slice(0,initialPopulation.length)
    for(let i=0;i<crosseOverPopulation.length-1;i++)
    {
      for(let j=i+1;j<crosseOverPopulation.length;j++)
      {
        const checkBoard=coupleCrossOver(crosseOverPopulation[i],crosseOverPopulation[j]);
        const fitness = getFitness(checkBoard);
        initialPopulation.push({checkBoard,fitness});
      }
    }
    initialPopulation.sort((a,b) => b.fitness-a.fitness);
  };

  const coupleCrossOver=(parent1,parent2)=>{

    const midpoint = Math.floor(parent1.length / 2);
    const parent1Chr = parent1.splice(0, midpoint);
    const parent2Chr = parent2.splice(midpoint,parent1.length);
    let child=  parent1Chr.concat(parent2Chr);    
    child=reformatChild(child);
    
  }

  const reformatChild=(child) =>{
    let colors:number[]=new Array(colorNumber).fill(checkBoardSize*checkBoardSize/colorNumber);

    for(let i=0;i<checkBoardSize;i++)
      for(let j=0;j<checkBoardSize;j++){
        colors[child[i][j]]--;
      }
    let goodformat=true;
    for(let i=0;i<colors.length;i++)
    {
      if(colors[i]!=0)
      {
        goodformat=false;
        break;
      }
    }
    if(!goodformat)
    {
      for(let i=0;i<checkBoardSize;i++)
      {
        for(let j=0;j<checkBoardSize;j++)
        {
          if(colors[child[i][j]]<0)
          {
            for(let index=0;index<colors.length;i++)
            {
              if(index!=child[i][j] && colors[index]>0)
              {
                colors[child[i][j]]++;
                colors[index]--;
                child[i][j]=index;
                break;
              }
            }
          }
        }  
      }
    }
  return child;
  }
  
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
  return (
    <div>
      <TextField label="Colors" variant="outlined" onChange={(e) => changeColor(e.target.value)} />
      <TextField label="Dimension (nxn)" variant="outlined" onChange={(e) => changeDimension(e.target.value)} />

      <Button sx={{ paddingTop: 3, marginLeft: 5 }} variant="contained" onClick={handleStart} disabled={disableGen}>
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
