import React from 'react';
import { Component } from 'react';
import './App.css';
import axios from 'axios';
import confetti from 'canvas-confetti'

interface Data {
  morningScore: [number, number],
  afternoonScore: [number, number],
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
  error: string | null
}

export default class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      data: null,
      infoString: '',
      error: null
    }
  }

  componentDidMount(): void {
    axios
      .get('http://localhost:4000')
      .then((result) => {
        this.setState({
          data: result.data as Data,
          error: null
        })
      }) 
      .catch((error) => {
        if (error.code === 'ERR_NETWORK') {
          this.setState({
            error: 'Error Fetching Data'
          })
        } else {
          if (error.response.status === 425) {
            this.setState({
              error: 'Data Hasn`t Loaded Yet'
            })
          } else {
            this.setState({
              error: 'Unknown Error'
            })
          } 
        }
      })
  }
  
  getBackgroundColor (aScore: [number, number], sky: string): string {
    if (aScore[0] === 5 && aScore[1] === 5 && (sky.includes('clear') || sky.includes('sunny'))) {
      return '#64db51';
    }
    const score: number = Math.floor(((aScore[0] + aScore[1]) / 10) * 5)
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
      score = Math.floor(((aScore[0] + aScore[1])/10)*5)
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
      output.push('gonna be a bit windy');
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
    const { data, error } = this.state;

    const morningScore: [number, number] = data?.morningScore!;
    const afternoonScore: [number, number] = data?.afternoonScore!;
    const nightScore: [number, number] = data?.nightScore!;

    const sky: string = data?.sky!;

    if (error) {
      return (  
        <div 
          className="App"
        >
          <div className='messege-container'>
            <span>
              { error }
            </span>
          </div>
        </div>
      )
    }

    if (data) {
      return (  
        <div 
          className="App"
          style={{ backgroundColor: `${this.getBackgroundColor(afternoonScore, sky)}`}}
        >
          <div className='messege-container'>
            <div>
              <span
                style={{ color: `${this.getBackgroundColor(afternoonScore, sky)}`}}
              >
                { this.generateTitle(afternoonScore, sky) }
              </span>
            </div>
            <div>
              <span
                style={{ color: `${this.getBackgroundColor(afternoonScore, sky)}`}}
                className='sub'
              >
                { this.generateSub(afternoonScore, sky) }
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
