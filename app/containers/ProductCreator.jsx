import React from 'react';
import { Link } from 'react-router';
let { connect } = require('react-redux');
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Rnd from 'react-rnd';
let actions = require('productActions');

class ProductCreator extends React.Component {
  constructor() {
    super();

    this.formData = new FormData();
    this.state = {
      file: null,
      fileCoordinates: {
        x: 0,
        y: 0
      },
      activeProduct: null,
      fileDimensions: {
        width: 0,
        height: 0
      },
      dropzoneActive: false,
      shirtStyles:
        {
          name: 'Triblend Short Sleeve T-shirt',
          image: '/images/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Clay.png'
        }
    };
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  handleCreateImage() {
    let backgroundImage = this.state.shirtStyles[this.state.activeShirtStyle].image;
    let filename = this.state.file;
    let fileDimensions = this.state.fileDimensions;
    let fileCoordinates = this.state.fileCoordinates;

    let data = {
      backgroundImage,
      filename,
      fileDimensions,
      fileCoordinates
    };

    console.log('creating image...', data);

    axios
      .post('/shopify/new_product_image', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('success creating image!: ', response);
      })
      .catch(error => console.log('Error creating image file: ', error));
  }

  onDrop(files) {
    let file = files[0];
    console.log('file: ', file);
    this.formData.append('file', file);

    axios
      .post('/upload/file', this.formData, {
        headers: {
          'Content-Type': file.type
        }
      })
      .then(response => {
        console.log('success!: ', response);

        this.setState({
          file: response.data.filename
        });
      })
      .catch(error => console.log('Error uploading file: ', error));
  }

  handleResized(e, data) {
    let x = data.x;
    let y = data.y;
    let width = e.path[1].clientWidth;
    let height = e.path[1].clientHeight;
    this.setState({
      fileCoordinates: { x, y },
      fileDimensions: { width, height }
    });
    console.log('x: ', x);
    console.log('y: ', y);
    console.log('width: ', width);
    console.log('height: ', height);
    console.log(this.state);
  }

  colorList() {
    // let { activeProduct } = this.state;

    // if (activeProduct) {
    //   return activeProduct.options.options[1].values.map(color => {
    //     return <div className="product-color-item" style={{ backgroundColor: `${color}` }} />;
    //   });
    // }
  }


  render() {
    let { activeProduct} = this.props;
    console.log('activeProduct: ' , activeProduct);

    let { file, shirtStyles,  dropzoneActive } = this.state;
    let dropzoneRef;

    return (
      <div className="pc">
        <div className="pc-container">
          <div className="pc-left">
            <label for="add-artwork">Add your artwork</label>
            <button type="button" className="button" onClick={() => { dropzoneRef.open(); }}>
              Upload artwork
            </button>
            <div>
              <button type="button" className="button" onClick={this.handleCreateImage.bind(this)}>
                Create Image
              </button>
            </div>
          </div>
          <div className="pc-middle">
            <div className="preview"
              style={{
                backgroundImage: `url('${activeProduct ? activeProduct.options.images[0].src : shirtStyles.image} ')`
              }}
            >
              <Dropzone
                disableClick={file ? true : false}
                onDrop={this.onDrop.bind(this)}
                onDragEnter={this.onDragEnter.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
                multiple={false}
                className={`dropzone ${dropzoneActive ? 'active' : ''} ${file ? 'accepted' : ''}`}
                ref={node => {
                  dropzoneRef = node;
                }}
              >
                <Rnd
                  default={{
                    x: this.state.fileCoordinates.x,
                    y: this.state.fileCoordinates.y,
                    width: 200,
                    maxWidth: 200
                  }}
                  bounds="parent"
                  onResizeStop={this.handleResized.bind(this)}
                  onDragStop={this.handleResized.bind(this)}
                >
                  {file ? <img src={`uploads/${file}`} /> : ''}
                </Rnd>
              </Dropzone>
            </div>
          </div>
          <div className="pc-right">
            <div className="product-arr-trigger">
              <Link to="/product_array">
                <img src="/images/PRODUCT ARRAY TRIGGER.png" alt="Product Array Trigger" />
              </Link>
              <h4>{`${activeProduct ? activeProduct.options.title : shirtStyles.name}`}</h4>
            </div>
            <div className="product-color-group">{this.colorList()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    activeProduct: state.products.active,
    collections: state.collections.all
  };
})(ProductCreator);