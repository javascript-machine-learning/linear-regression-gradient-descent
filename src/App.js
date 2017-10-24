import React from 'react';
import './App.css';

// adjust training set size

const M = 10;

// generate random training set

const DATA = [];

const getRandomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const createRandomPortlandHouse = () => ({
  squareMeter: getRandomIntFromInterval(0, 100),
  price: getRandomIntFromInterval(0, 100),
});

for (let i = 0; i < M; i++) {
  DATA.push(createRandomPortlandHouse());
}

const x = DATA.map(date => date.squareMeter);
const y = DATA.map(date => date.price);

// linear regression and gradient descent

const LEARNING_RATE = 0.0003;

let thetaOne = 0;
let thetaZero = 0;

const hypothesis = x => thetaZero + thetaOne * x;

const learn = (alpha) => {
  let thetaZeroSum = 0;
  let thetaOneSum = 0;

  for (let i = 0; i < M; i++) {
    thetaZeroSum += hypothesis(x[i]) - y[i];
    thetaOneSum += (hypothesis(x[i]) - y[i]) * x[i];
  }

  thetaZero = thetaZero - (alpha / M) * thetaZeroSum;
  thetaOne = thetaOne - (alpha / M) * thetaOneSum;
}

const cost = () => {
  let sum = 0;

  for (let i = 0; i < M; i++) {
    sum += Math.pow(hypothesis(x[i]) - y[i], 2);
  }

  return sum / (2 * M);
}

// count iterations

let iteration = 0;

// view

class App extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.onLearn, 1);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onLearn = () => {
    learn(LEARNING_RATE);

    iteration++;

    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <Plot
          x={'squareMeter'}
          y={'price'}
        />

        <div>
          <Iteration iteration={iteration} />
          <Hypothesis />
          <Cost />
        </div>
      </div>
    );
  }
}

const Plot = ({ x, y }) =>
  <svg width="100" height="100">
    <line
      x1="0"
      y1={100 - hypothesis(0)}
      x2="100"
      y2={100 - hypothesis(100)}
    />

    {DATA.map((date, key) =>
      <circle
        key={key}
        cx={date[x]}
        cy={100 - date[y]}
      />
    )}
  </svg>

const Iteration = ({ iteration }) =>
  <p>
    <strong>Iteration:</strong> {iteration}
  </p>

const Hypothesis = () =>
  <p>
    <strong>Hypothesis:</strong> f(x) = {thetaZero.toFixed(2)} + {thetaOne.toFixed(2)}x
  </p>

const Cost = () =>
  <p>
    <strong>Cost:</strong> {cost().toFixed(2)}
  </p>

export default App;
