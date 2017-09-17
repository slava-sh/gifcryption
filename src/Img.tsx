import * as React from 'react';

interface ImgProps {  // TODO: extends React.Props<img>
  buffer: Buffer | null;
  download?: string;
  onClick?: any;
  className?: string;
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
    const url = this.state.url || '';
    const img = <img {...this.props} src={url} />;
    return this.props.download ?
      <a href={url} download={this.props.download} target="_blank">{img}</a> :
      img;
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
