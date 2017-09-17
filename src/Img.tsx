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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.download &&
      this.state.url !== null &&
      this.state.url !== prevState.url) {
      downloadURI(this.state.url, this.props.download);
    }
  }

  render() {
    const url = this.state.url || '';
    const { buffer, download, ...otherProps } = this.props;
    return <img {...otherProps} src={url} />;
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

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
