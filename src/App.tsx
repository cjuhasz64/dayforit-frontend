import React from 'react';
import { Component } from 'react';
import './App.css';
import axios from 'axios';
import confetti from 'canvas-confetti'

interface Data {
  dayScore: [number, number]
  nightScore: [number, number],
  sky: string,
  liftsOpen: string,
  minTemp: string,
  maxTemp: string,
  snowDepth: string
}

interface Props {
}

interface State {
  data: Data | null,
  infoString: string,
}


export default class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      data: null,
      infoString: ''
    }
  }

  componentDidMount(): void {
    axios
      .get('http://localhost:4000')
      .then((result) => {
        this.setState({
          data: result.data as Data
        })
      })



  }
  
  getBackgroundColor (aScore: [number, number], sky: string): string {
    if (aScore[0] === 5 && aScore[1] === 5 && (sky.includes('clear') || sky.includes('sunny'))) {
      return '#64db51';
    }

    const score: number = Math.round(((aScore[0] + aScore[1]) / 10) * 5)
    if (score === 1) {
      return '#fe9f7f'
    } else if (score === 2) {
      return '#febf7f'
    } else if (score === 3) {
      return '#fede7f'
    } else if (score === 4) {
      return '#fefe7f'
    } else {
      return '#a4d369'  
    }
  }

  generateTitle (aScore: [number, number], sky: string): string {
    let output: string [] = [];
    let score: number;

    if (aScore[0] === 5 && aScore[1] === 5 && (sky.includes('clear') || sky.includes('sunny'))) {
      return 'Absolute day for it, doesn`t get any better!';
    }

    if (aScore[0] === -1) {
      score = -1
    } else {
      score = Math.round(((aScore[0] + aScore[1])/10)*5)
    }

    // main reponse
    if (score === -1) {
      return 'Give it a miss';
    } else if (score === 1) {
      output.push('Give it a miss');
    } else if (score === 2) {
      output.push('Probably not great');
    } else if (score === 3) {
      output.push('Might be ok');
    } else if (score === 4) {
      output.push('Should be good');
    } else if (score === 5) {
      output.push('Day for it');
    }

    return `${output}`;
  }

  generateSub (aScore: [number, number], sky: string): string {
    let output: string [] = [];
    let score: number;

    if (aScore[0] === -1) {
      score = -1
    } else {
      score = Math.round(((aScore[0] + aScore[1])/10)*5)
    }

    // wind
    if (aScore[0] === -1) {
      return 'Windy af!'
    } else if (aScore[0] <= 2) {
      output.push('gonna be windy');
    } else if (aScore[0] <= 3) {
      output.push('looking to be a bit windy');
    } 

    // sky
    if (sky.includes('cloudy')) {
      output.push('looking to be cloudy');
    }

    // rain
    if (aScore[1] === 4) {
      output.push('slight chance of small showers');
    } else if (aScore[1] === 3) {
      output.push('good chance of showers');
    } else if (aScore[1] === 2) {
      output.push('high chance of showers');
    } else if (aScore[1] === 1) {
      output.push('gonna be wet');
    }

    return `${output.join(', ').charAt(0).toUpperCase() + output.join(', ').slice(1)}.`;
  }

  render () {
    
      const { data } = this.state;

      const dayScore: [number, number] = data?.dayScore!;
      const nightScore: [number, number] = data?.nightScore!;
      const sky: string = data?.sky!;


      if (data) {
        return (  
          <div 
            className="App"
            style={{ backgroundColor: `${this.getBackgroundColor(dayScore, sky)}`}}
          >
            <canvas></canvas>
            <div className='messege-container'>
              <div>
                <span
                  style={{ color: `${this.getBackgroundColor(dayScore, sky)}`}}
                >
                  { this.generateTitle(dayScore, sky) }
                </span>

              </div>
              <div>
                <span
                  style={{ color: `${this.getBackgroundColor(dayScore, sky)}`}}
                  className='sub'
                >
                  { this.generateSub(dayScore, sky) }
                </span>
              </div>
            </div>
            
          </div>
        )
      } else {
        return (  
          <div 
            className="App"
          >
          </div>
        )
      }

  } 
}
