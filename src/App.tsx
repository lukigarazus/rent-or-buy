import React from "react";

import "./styles.css";

const makeArray = (length: number) => Array(length).fill(undefined);

const zip = (...arrays: any[][]) => {
  if (!arrays.length) return [];
  arrays.sort((a, b) => a.length - b.length);
  return arrays[0].map((_, i) => arrays.map((array) => array[i]));
};

const sum = (arr: number[]) => arr.reduce((acc, el) => acc + el, 0);

const series = (
  length: number,
  formula: (arg: number, i: number) => number,
  init: number
) => {
  return makeArray(length).reduce((acc, el, i) => {
    const next = i ? formula(acc[i - 1], i) : init;
    acc.push(next);
    return acc;
  }, []);
};

export default function App() {
  const [housePrice, setHousePrice] = React.useState(470000);
  const [duration, setDuration] = React.useState(5);
  const [rent, setRent] = React.useState(3500);
  const [downPayment, setDownPayment] = React.useState(200000);
  const [interestRate, setInterestRate] = React.useState(10);
  const [paidOffAfter, setPaidOffAfter] = React.useState(5);
  const [realEstateAppreciation, setRealEstateAppreciation] = React.useState(
    0.5
  );

  const yearlyRent = rent * 12;
  const borrowedCapital = housePrice - downPayment;
  const percentInterest = interestRate / 100;
  const percentRealEstateAppreciation = realEstateAppreciation / 100;
  const realPaidOffAfter = paidOffAfter - 1;

  const rentCosts = series(duration, (x) => x + yearlyRent, yearlyRent);
  const maitanenceCosts = series(
    duration,
    (x) => housePrice * 0.01 + x,
    housePrice * 0.01
  );
  const capitalCosts = series(
    duration,
    (x, i) =>
      i > realPaidOffAfter ? 0 : borrowedCapital * percentInterest + x,
    borrowedCapital * percentInterest
  );
  const realEstateGains = series(
    duration,
    (x, i) =>
      Math.floor(
        housePrice * Math.pow(1 + percentRealEstateAppreciation, i + 1) -
          housePrice
      ),
    Math.floor(housePrice * (1 + percentRealEstateAppreciation) - housePrice)
  );

  const rows = zip(rentCosts, maitanenceCosts, capitalCosts, realEstateGains);

  return (
    <div className="App">
      <div>
        <input
          type="number"
          value={housePrice}
          onChange={(ev) => setHousePrice(+ev.target.value)}
        />
        <input
          type="number"
          value={duration}
          onChange={(ev) => setDuration(+ev.target.value)}
        />
        <input
          type="number"
          value={rent}
          onChange={(ev) => setRent(+ev.target.value)}
        />
        <input
          type="number"
          value={downPayment}
          onChange={(ev) => setDownPayment(+ev.target.value)}
        />
        <input
          type="number"
          value={interestRate}
          onChange={(ev) => setInterestRate(+ev.target.value)}
        />
        <input
          type="number"
          value={paidOffAfter}
          onChange={(ev) => setPaidOffAfter(+ev.target.value)}
        />
        <input
          type="number"
          value={realEstateAppreciation}
          onChange={(ev) => setRealEstateAppreciation(+ev.target.value)}
        />
      </div>
      <hr />
      <div>
        <table>
          <tr>
            <th>Koszt wynajmu</th>
            <th>Koszty utrzymania</th>
            <th>Koszt kapitału</th>
            <th>Wzrost wartości nieruchomości</th>
          </tr>
          {rows.map((row) => (
            <tr>
              {row.map((el) => (
                <td>{el}</td>
              ))}
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
