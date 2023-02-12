"use client";
import React, { useState } from "react";

// Initialize the checkboard
const rows = 10;
const columns = 10;
const colors = 5;

const randomColor = () => Math.floor(Math.random() * colors) + 1;

const createCheckboard = () => {
  const checkboard = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(randomColor());
    }
    checkboard.push(row);
  }
  return checkboard;
};

const fitness = (chromosome: any[][]) => {
  let fitness = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (
        (i > 0 && chromosome[i][j] === chromosome[i - 1][j]) ||
        (j > 0 && chromosome[i][j] === chromosome[i][j - 1])
      ) {
        fitness--;
      }
    }
  }
  return fitness;
};

const mutation = (chromosome: number[][]) => {
  const randomRow = Math.floor(Math.random() * rows);
  const randomColumn = Math.floor(Math.random() * columns);
  chromosome[randomRow][randomColumn] = randomColor();
  return chromosome;
};

const crossover = (chromosomes: string | any[]) => {
  const newChromosomes = [];
  for (let i = 0; i < chromosomes.length; i += 2) {
    const chromosome1 = chromosomes[i];
    const chromosome2 = chromosomes[i + 1];
    const randomRow = Math.floor(Math.random() * rows);
    const offspring1 = chromosome1.map((row: any, index: number) => (index < randomRow ? row : chromosome2[index]));
    const offspring2 = chromosome2.map((row: any, index: number) => (index < randomRow ? row : chromosome1[index]));
    newChromosomes.push(offspring1, offspring2);
  }
  return newChromosomes;
};

const geneticAlgorithm = (chromosomes: any[], iterations: number) => {
  let bestChromosome = chromosomes[0];
  let bestFitness = fitness(bestChromosome);
  for (let i = 0; i < iterations; i++) {
    chromosomes = chromosomes.map((chromosome: any) => mutation(chromosome));
    chromosomes = crossover(chromosomes);
    chromosomes.forEach((chromosome: any) => {
      const currentFitness = fitness(chromosome);
      if (currentFitness > bestFitness) {
        bestFitness = currentFitness;
        bestChromosome = chromosome;
      }
    });
  }
  return bestChromosome;
};

const Checkboard = () => {
  const [checkboard, setCheckboard] = useState(createCheckboard());

  const handleSolve = () => {
    const chromosomes = Array(20)
      .fill(null)
      .map(() => createCheckboard());

    const solvedCheckboard = geneticAlgorithm(chromosomes, 100);
    setCheckboard(solvedCheckboard);
  };
  console.log(checkboard);
  return (
    <div>
      <button onClick={handleSolve}>Solve</button>
      <table>
        <tbody>
          {checkboard.map((row, i) => (
            <tr key={i}>
              {row.map((color, j) => (
                <td key={j} style={{ backgroundColor: `hsl(${color * 60}, 100%, 50%)` }} >{"   tttttt  "}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Checkboard;
