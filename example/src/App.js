import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'

import Pdf from 'ngager-pdfwriter'

const domtoimage = require('dom-to-image');

function randomScalingFactor() {
  return Math.floor(Math.random() * 100);
}

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [{
    label: 'Dataset 1',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    borderColor: 'rgb(255, 99, 132)',
    borderWidth: 1,
    data: [
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor()
    ]
  }, {
    label: 'Dataset 2',
    backgroundColor: 'rgba(255, 159, 64, 0.5)',
    borderColor: 'rgb(255, 159, 64)',
    borderWidth: 1,
    data: [
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor(),
      randomScalingFactor()
    ]
  }]
};
const layout = {
  padding: Object.assign(
    {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  )
};

const text = '3. <b>Consultation Services</b>: The Recruitment team provides <b>consultation on </b>new and replacement positions - hiring  –  process, salary<b> range, </b> hehehe<br><br>   <b>availability, possible</b> challenges/risks and strategies <br>to close the roles.<br>Hahaha';

export default class App extends Component {
  async onClick() {
    console.log('onClick', this.props);
    const pdf = new Pdf();
    pdf.setFilename('test.pdf');
    try {
      pdf.addText(text);
      pdf.addText(' ');
      const dataUrl = await domtoimage.toPng(this.chart);
      pdf.addImage(dataUrl);
    } catch (e) {
      console.log('ERROR', e);
    }
    pdf.save();
  }

  render () {
    return (
      <div style={{ display: 'flex', margin: 'auto', flexDirection: 'column', maxWidth: 700 }}>
        <p dangerouslySetInnerHTML={{ __html: text }} />
        <div
          ref={el => {
              this.chart = el || this.chart;
            }}
          style={{ display: 'flex', flex: 1, maxHeight: 400, marginBottom: 50 }}
        >
          <Bar
            data={data}
            height={400}
            options={{
              cornerRadius: 0,
              layout,
              maintainAspectRatio: false,
              legend: {
                display: false
              },
              scales: {
                xAxes: [
                  Object.assign(
                    {
                      barThickness: 40,
                      gridLines: {
                        display: false,
                        offsetGridLines: false
                      },
                      stacked: true
                    }
                  )
                ],
                yAxes: [
                  Object.assign(
                    {
                      barPercentage: 0.9,
                      categoryPercentage: 0.55,
                      ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100,
                        callback: value => {
                          if (value % 1 === 0) {
                            return value;
                          }
                          return null;
                        }
                      }
                    }
                  )
                ]
              }
            }}
          />
        </div>
        <button onClick={() => this.onClick()}>Download PDF</button>
      </div>
    )
  }
}
