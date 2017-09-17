import * as React from 'react';
import './App.css';
import * as stego from './stego';
import * as Giphy from 'giphy-api';
import Img from './Img';

interface AppProps {
}

interface AppState {
  image: Buffer | null;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      image: null,
    }
    fetchBuffer(require('./test.gif'))
      .then(buf => this.setState({ image: buf }));
  }

  componentWillMount() {
    this.refreshImage();
  }

  refreshImage() {
    const giphy = Giphy();
    giphy.random({rating: 'g'})
      .then(response => response.data.image_url)
      .then(url => fetchBuffer(url))
      .then(buf => this.setState({ image: buf }));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <Img buffer={this.state.image} />
          <input type="button" onClick={() => this.refreshImage()} value="refresh" />
        </div>
        <div>
          <textarea name="message" />
        </div>
        <div>
          <input type="submit" value="encrypt" />
        </div>
      </form>
    );
  }

  handleSubmit(e: React.SyntheticEvent<any>) {
    e.preventDefault();
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
