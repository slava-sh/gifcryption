import * as React from 'react';
import './App.css';
import * as stego from './stego';
import * as Giphy from 'giphy-api';
import Img from './Img';
import Dropzone from 'react-dropzone';

interface AppProps {
}

interface AppState {
  inputImage: Buffer | null;
  message: string,
  outputImage: Buffer | null;
  download?: string;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      inputImage: null,
      message: 'Write text to hide in a GIF...',  // TODO: Make the placeholder disappear.
      outputImage: null,
      download: undefined,
    }
  }

  componentWillMount() {
    this.refreshInputImage();
  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <div className="container">
          <div className="left">
            <Img
              className="input-image"
              buffer={this.state.inputImage}
              onClick={() => this.refreshInputImage()} />
          </div>
          <div className="middle">
            <div>
              <textarea
                value={this.state.message}
                onChange={e => this.updateMessage(e.target.value)} />
            </div>
            <div>
              <input type="submit" value="encrypt" />
            </div>
          </div>
          <div className="right">
            <Dropzone onDrop={files => this.onDecrypt(files)} style={{
              width: 400,
              height: 400,
              borderWidth: 2,
              borderColor: '#666',
              borderStyle: 'dashed',
              borderRadius: 5,
            }}>
              {!this.state.outputImage && 'Drop here to decrypt...'}
              <Img buffer={this.state.outputImage} download={this.state.download} />
            </Dropzone>
          </div>
        </div>
      </form>
    );
  }

  updateMessage(message: string) {
    this.setState({ message });
  }

  handleSubmit(e: React.SyntheticEvent<any>) {
    e.preventDefault();
    const encoded = stego.encode(this.state.inputImage!, this.state.message);
    this.setState({ outputImage: encoded, download: "encrypted.gif" });
  }

  onDecrypt(files) {
    const file = files[0];
    readAsArrayBuffer(file).then(image => {
      const message = stego.decode(image);
      this.setState({ message, outputImage: image, download: undefined });
    });
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
  return fetch(url).then(response => response.blob()).then(readAsArrayBuffer);
}

function readAsArrayBuffer(blobOrFile) {
  return new Promise<Buffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function() {
      resolve(Buffer.from(this.result));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blobOrFile);
  });
}
