import * as React from 'react';
import './App.css';
import * as stego from './stego';
import * as Giphy from 'giphy-api';
import Img from './Img';

interface AppProps {
}

interface AppState {
  inputImage: Buffer | null;
  message: string,
  outputImage: Buffer | null;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      inputImage: null,
      message: '',
      outputImage: null,
    }
    fetchBuffer(require('./test.gif'))
      .then(buf => this.setState({ inputImage: buf }));
  }

  componentWillMount() {
    this.refreshInputImage();
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <div>
            <Img
              className="input-image"
              buffer={this.state.inputImage}
              onClick={() => this.refreshInputImage()} />
          </div>
          <div>
            <textarea
              value={this.state.message}
              onChange={e => this.updateMessage(e.target.value)} />
          </div>
          <div>
            <input type="submit" value="encrypt" />
          </div>
        </form>
        <div>
          <Img buffer={this.state.outputImage} download="encrypted.gif" />
        </div>
      </div>
    );
  }

  updateMessage(message: string) {
    this.setState({ message });
  }

  handleSubmit(e: React.SyntheticEvent<any>) {
    e.preventDefault();
    const image = Buffer.from(this.state.inputImage!);
    const encoded = stego.encode(image, this.state.message);
    this.setState({ outputImage: encoded });
  }

  refreshInputImage() {
    const giphy = Giphy({ https: true });
    giphy.random({ rating: 'g' })
      .then(response => response.data.image_url)
      .then(url => fetchBuffer(url))
      .then(buf => this.setState({ inputImage: buf }));
  }
}

export default App;

function fetchBuffer(url: string): Promise<Buffer> {
  return fetch(url).then(response => {
    return response.blob();
  }).then(blob => new Promise<Buffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function() {
      resolve(this.result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  }));
}
