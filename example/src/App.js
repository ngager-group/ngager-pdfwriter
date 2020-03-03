import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2'

import Pdf from 'ngager-pdfwriter'

const html2canvas = require('html2canvas');

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

const text = '3. <b>Consultation Services</b>: The Recruitment team provides <b>consultation on </b>new and replacement positions - hiring  –  process, salary<b> range, </b> hehehe<br><br>   <b>availability, possible</b> challenges/risks and strategies <br>to close the roles.';

const text2 = 'The man who knows his worth respects his fellow man because he respects himself first. He does not boast; is not self-seeking; nor does he force his personal opinion on others.';

const text3 = '<span style="color: #FF6347;font-weight: bold;">#</span> What website or app has completely changed your life for better or for worse?'

export default class App extends Component {
  async onClick() {
    // console.log('onClick', this.props);
    const pdf = new Pdf({ defaultFontSize: 11, defaultColor: '#222222' });
    // pdf.setHost('http://localhost')
    try {
      pdf.addText(text, { fontSize: 12, color: '#BBBBBB' });
      pdf.addText(' ');
      pdf.addIcon('', { color: '#BBBBBB' });
      pdf.moveUp();
      pdf.addText(text2, null, { indent: 16 });
      pdf.addText(' ');
      pdf.addText(text3);
      pdf.addText(' ');
      const canvas = await html2canvas(this.chart);
      const dataUrl = canvas.toDataURL();
      // const dataUrl = await domtoimage.toPng(this.chart);
      pdf.addImage(dataUrl);
    } catch (e) {
      console.log('ERROR', e);
    }
    // const blob = await pdf.output();
    // console.log('blob', blob);
    await pdf.save('test.pdf');
  }

  render () {
    return (
      <div style={{ display: 'flex', margin: 'auto', flexDirection: 'column', maxWidth: 700 }}>
        <p style={{ color: '#BBBBBB' }} dangerouslySetInnerHTML={{ __html: text }} />
        <p>
          <i style={{ paddingRight: 6, color: '#BBBBBB' }} className='fas fa-quote-left'></i>
           {text2}
        </p>
        <p dangerouslySetInnerHTML={{ __html: text3 }} />
        <div
          ref={el => {
              this.chart = el || this.chart;
            }}
          style={{ display: 'flex', flex: 1, maxHeight: 400, marginBottom: 50 }}
        >
          <Bar
            data={data}
            height={300}
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
