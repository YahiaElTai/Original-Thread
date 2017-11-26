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
      activeImage: "https://cdn.shopify.com/s/files/1/2485/3042/products/Bella_Canvas_8413_Triblend_Short_Sleeve_T-shirt_-_Clay.png?v=1509004973",
      file: null,
      fileCoordinates: {
        x: 0,
        y: 0
      },
      fileDimensions: {
        width: 0,
        height: 0
      },
      dropzoneActive: false
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

    let projectTitle = this.refs.projectTitle.value;
    let projectDescription = this.refs.projectDescription.value;
    let backgroundImage = this.state.activeImage;
    let filename = this.state.file;
    let fileDimensions = this.state.fileDimensions;
    let fileCoordinates = this.state.fileCoordinates;

    let data = {
      projectTitle,
      projectDescription,
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
        const newProduct = response.data;
        console.log("newProduct: ", newProduct);

        return axios
          .put('/shopify/update_live_feed', newProduct , {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
              console.log('producted added succes!');
        })
        .catch( error => console.log('Error adding product: ', error));
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

  handleActiveColor(index) {
    let { activeProduct } = this.props;
      console.log("index:" , index);
      this.setState({activeImage: activeProduct.options.images[index].src});
  }

  colorList() {
    let { activeProduct } = this.props;


    if (activeProduct) {
      let colorArray = activeProduct.options.options;
      if (colorArray.length > 1) {
        return activeProduct.options.options[1].values.map( (color, index) => {
          return <div onClick={this.handleActiveColor.bind(this, index)} className="pc-product-color-item" style={{ backgroundColor: `${color}` }} />;
        });
      }
    }
  }

  componentDidMount() {
    let { activeProduct } = this.props;
    this.setState({activeImage: activeProduct.options.images[0].src});
  }


  render() {
    let { activeProduct} = this.props;
    console.log('activeProduct: ' , activeProduct);

    let { file,  dropzoneActive , activeImage} = this.state;
    let dropzoneRef;

    return (
      <div className="pc">
        <div className="pc-container">
          <div className="pc-left">

          <div className="btn-group">
              <div className="btn-item" onClick={() => { dropzoneRef.open(); }}>
                <i className="fa fa-camera" aria-hidden="true"></i>
                <p>ARTWORK</p>
              </div>
              <div className="btn-item">
                <i className="fa fa-bomb" aria-hidden="true"></i>
                <p>DESIGNLIBRARY</p>
              </div>
              <div className="btn-item">
                <i className="fa fa-font" aria-hidden="true"></i>
                <p>TEXT</p>
              </div>
          </div>

          <div className="product-details">
            <h6>Project Title</h6>
            <input type="text" className="project-title"  ref="projectTitle" defaultValue="Yo Momma's Bounds"/>

            <h6>Description</h6>
            <textarea type="text" className="project-description"  ref="projectDescription" defaultValue="with a seamless product creation app, Original Thread will definitely take all the heavy lifting and leave you the creative process..."></textarea>
          </div>


          </div>
          <div className="pc-middle">
            <div className="preview"
              style={{
                backgroundImage: `url('${activeImage ? activeImage : ""} ')`
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
              <h4>{activeProduct ? activeProduct.options.title : ""}</h4>
              <p>60% Cotton  30% Polyster</p>
            </div>
            <div className="pc-product-color-group">{this.colorList()}</div>
          </div>
        </div>
        <div className="decisions">
          <i className="fa fa-refresh" aria-hidden="true"></i>
          <button className="save-work"> Save Work</button>
          <button type="button" className="publish" onClick={this.handleCreateImage.bind(this)}>Publish</button>
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