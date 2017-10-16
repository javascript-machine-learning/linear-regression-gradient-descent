import React from 'react';
import './App.css';

// adjust training set size

const M = 5;

// generate random training set

const DATA = [];

const getRandomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const createRandomPortlandHouse = () => ({
  squareMeter: getRandomIntFromInterval(0, 500),
  price: getRandomIntFromInterval(0, 500),
});

for (let i = 0; i < M; i++) {
  DATA.push(createRandomPortlandHouse());
}

const x = DATA.map(date => date.squareMeter);
const y = DATA.map(date => date.price);

// linear regression and gradient descent

const LEARNING_RATE = 0.000001;

let m = 0;
let b = 0;

const hypothesis = x => m * x + b;

const learn = (alpha) => {
  if (x.length <= 0) return;

  let sum1 = 0;
  let sum2 = 0;

  for (var i = 0; i < x.length; i++) {
    sum1 += hypothesis(x[i]) - y[i];
    sum2 += (hypothesis(x[i]) - y[i]) * x[i];
  }

  // b didn't change as much as m, so the learning rate is adjusted, anyone knows why?
  b = b - 100000 * alpha * sum1 / (x.length);
  m = m - alpha * sum2 / (x.length);
}

const cost = () => {
  let sum = 0;

  for (var i = 0; i < x.length; i++) {
    sum += Math.pow(hypothesis(x[i]) - y[i], 2);
  }

  return sum / (2 * m);
}

// count iterations

let iteration = 0;

// view

class App extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.onLearn, 100);
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
  <svg width="500" height="500">
    <line
      x1="0"
      y1={500 - hypothesis(0)}
      x2="500"
      y2={500 - hypothesis(500)}
    />

    {DATA.map((date, key) =>
      <circle
        key={key}
        cx={date[x]}
        cy={500 - date[y]}
      />
    )}
  </svg>

const Iteration = ({ iteration }) =>
  <p>
    <strong>Iteration:</strong> {iteration}
  </p>

const Hypothesis = () =>
  <p>
    <strong>Hypothesis:</strong> f(x) = {m.toFixed(2)}x + {b.toFixed(2)}
  </p>

const Cost = () =>
  <p>
    <strong>Cost:</strong> {cost().toFixed(2)}
  </p>

export default App;
