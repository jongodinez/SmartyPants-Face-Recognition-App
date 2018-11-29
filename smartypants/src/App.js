import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({
  apiKey: '1facde4951a84e938c3ca8cf2b5a163a'
 });

const particlesOptions = {
  "particles": {
    "number": {
        "value": 350,
        "density": {
            "enable": true,
            "value_area": 1500
        }
    },
    "line_linked": {
        "enable": true,
        "opacity": 1
    },
    "move": {
        "direction": "right",
        "speed": 0.5
    },
    "size": {
        "value": 1
    },
    "opacity": {
        "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0.5
        }
    }
},
"interactivity": {
    "events": {
        "onhover": {
            "enable": true,
            "mode": "repulse"
        }
    },
    "modes": {
        "push": {
            "particles_nb": 2
        }
    }
},
"retina_detect": true
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);  
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

 onButtonSubmit = () => {
   this.setState({imageUrl: this.state.input})
   app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
   }

  onRouteChange =(route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route ==='home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          
          : (
            route === 'signin' 
            ? <Signin onRouteChange ={this.onRouteChange}/>
            : <Register onRouteChange ={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
