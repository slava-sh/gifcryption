import * as React from 'react';

interface ImgProps {
  buffer: Buffer | null;
}

interface ImgState {
  url: string | null;
}

class Img extends React.Component<ImgProps, ImgState> {
  constructor(props: ImgProps) {
    super(props);
    this.state = {
      url: null,
    };
  }

  componentWillReceiveProps(nextProps: ImgProps) {
    if (nextProps.buffer === null) {
      this.setState({ url: null });
    } else {
      bufferToDataURL(nextProps.buffer).then(url => this.setState({ url }));
    }
  }

  render() {
    return (
      <img src={this.state.url || ''} />
    );
  }
}

export default Img;

function bufferToDataURL(buf: Buffer): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function() {
      resolve(this.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(new Blob([buf]));
  });
}
