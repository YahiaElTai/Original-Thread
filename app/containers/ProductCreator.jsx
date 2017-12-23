import React from 'react';
import { Textfit } from 'react-textfit';
import { Link } from 'react-router';
let { connect } = require('react-redux');
import Dropzone from 'react-dropzone';
import axios from 'axios';
import Rnd from 'react-rnd';
let actions = require('productActions');
import { ChromePicker } from 'react-color';
import FontPicker from 'react-font-picker';

class ProductCreator extends React.Component {
  constructor() {
    super();
    this.formData = new FormData();
    this.validateText = this.validateText.bind(this);
    this.state = {
      activeImage: '',
      file: null,
      fileCoordinates: {
        x: 0,
        y: 0
      },
      fileDimensions: {
        width: 150,
        height: 150
      },

      dropzoneActive: false,
      text: 'Yo Mama So Fat',
      textCoordinates: {
        x: 24,
        y: 217
      },
      textDimensions: {
        width: 426,
        height: 94
      },
      fontSize: '51.7',
      textColor: '#000000',
      boldStyle: 'normal',
      italicStyle: 'normal',
      showFontPicker: false,
      fontFamily: 'Arial',
      aspectRatio: 0.256,
      showTextField: true,
      errorMessage: false,
      transformMode: true,
      editMode: false,
      showColorPicker: false,
      selectedColor: 0,
      colorCount: 15
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
    let text = this.state.text;
    let aspectRatio = this.state.aspectRatio;
    let textCoordinates = this.state.textCoordinates;
    let textDimensions = this.state.textDimensions;
    let fontSize = this.state.fontSize;
    let textColor = this.state.textColor;
    let boldStyle = this.state.boldStyle;
    let italicStyle = this.state.italicStyle;
    let fontFamily = this.state.fontFamily;
    let projectTitle = this.refs.projectTitle.value;
    let projectDescription = this.refs.projectDescription.value;
    let backgroundImage = this.state.activeImage;
    let filename = this.state.file;
    let fileDimensions = this.state.fileDimensions;
    let fileCoordinates = this.state.fileCoordinates;

    let data = {
      text,
      aspectRatio,
      textCoordinates,
      textDimensions,
      fontSize,
      textColor,
      boldStyle,
      italicStyle,
      fontFamily,
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
        console.log('newProduct: ', newProduct);

        return axios
          .put('/shopify/update_live_feed', newProduct, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            console.log('producted added succes!');
          })
          .catch(error => console.log('Error adding product: ', error));
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

  handleOnResize(e, direction, ref, delta, position) {
    this.setState({
      fileDimensions: {
        width: ref.offsetWidth,
        height: ref.offsetHeight
      },
      fileCoordinates: {
        ...position
      }
    });
  }

  handleTextOnResize(e, direction, ref, delta, position) {
    let { aspectRatio, textDimensions } = this.state;
    this.setState({
      editMode: false,
      fontSize: 0.55 * ref.offsetHeight,
      textDimensions: {
        width: ref.offsetWidth,
        height: ref.offsetHeight
      },
      textCoordinates: {
        ...position
      }
    });

    this.validateText(position.x, position.y, ref.offsetWidth);
  }

  getSize(e) {
    let { fontSize, textDimensions, textCoordinates } = this.state;
    let textValue = e.target.value;
    let size = textValue.length;
    let height = textDimensions.height;

    if (size === 0) {
      this.setState({
        fontSize: fontSize,
        textDimensions: { height: textDimensions.height, width: textDimensions.width }
      });

    } else {
      this.setState({
        text: textValue,
        textDimensions: { width: size * (10 * fontSize / 16.5), height: height },
        aspectRatio: height / (size * (10 * fontSize) / 16.5)
      });
    }
    this.validateText(textCoordinates.x, textCoordinates.y, textDimensions.width);
  }

  handledragged(e, d) {
    let x = d.x;
    let y = d.y;

    this.setState({ fileCoordinates: { x, y } });
  }

  handleTextdragged(e, d) {
    let { textDimensions } = this.state;
    let x = d.x;
    let y = d.y;

    this.validateText(x, y, textDimensions.width);
    this.setState({ textCoordinates: { x, y }, editMode: false });
  }

  handleActiveColor(index) {
    let { activeProduct } = this.props;
    this.setState({ activeImage: activeProduct.options.images[index].src, selectedColor: index });
  }

  colorList() {
    let { selectedColor, colorCount } = this.state;
    let { activeProduct } = this.props;

    if (activeProduct) {
      let colorArray = activeProduct.options.options;
      if (colorArray.length > 1 && colorCount < 13) {
        return activeProduct.options.options[1].values.map((color, index) => {
          return (
            <div
              onClick={this.handleActiveColor.bind(this, index)}
              className={selectedColor === index ? 'pc-product-color-item shadow' : 'pc-product-color-item'}
            >
              <div className="pc-product-color" style={{ backgroundColor: `${color}` }} />
              <div className="color-name">{color}</div>
            </div>
          );
        });
      } else if (colorArray.length > 1 && colorCount > 13) {
        return activeProduct.options.options[1].values.map((color, index) => {
          return <div onClick={this.handleActiveColor.bind(this, index)} className="product-color-item" style={{ backgroundColor: `${color}` }} />;
        });
      }
    }
  }

  componentDidMount() {
    let { activeProduct } = this.props;
    this.setState({ activeImage: activeProduct.options.images[0].src, colorCount: activeProduct.options.options[1].values.length });
  }

  validateText(x, y, width) {
    if (x < 140) {
      this.setState({ errorMessage: true });
    } else if (x > 140 && width > 205) {
      this.setState({ errorMessage: true });
    } else if (x > 280) {
      this.setState({ errorMessage: true });
    } else if (x > 200 && width > 110) {
      this.setState({ errorMessage: true });
    } else if (y < 180 || y > 339) {
      this.setState({ errorMessage: true });
    } else {
      this.setState({ errorMessage: false });
    }
  }

  handleMouseEnter() {
    this.setState({ transformMode: true });
  }

  exitTransformMode() {
    this.setState({ transformMode: false });
  }

  handleChangeComplete(color, event) {
    this.setState({ textColor: color.hex });
  }

  handleDoubleClick() {
    this.setState({ editMode: true, transformMode: false });
  }

  exitEditMode() {
    this.setState({ editMode: false, showColorPicker: false, showFontPicker: false });
  }

  handleColorPicker() {
    let { showColorPicker } = this.state;
    this.setState({ showColorPicker: !showColorPicker });
  }

  handleBoldStyle() {
    let { boldStyle } = this.state;
    if (boldStyle === 'normal') {
      this.setState({ boldStyle: 'bold' });
    } else {
      this.setState({ boldStyle: 'normal' });
    }
  }

  handleItalicStyle() {
    let { italicStyle } = this.state;
    if (italicStyle === 'normal') {
      this.setState({ italicStyle: 'italic' });
    } else {
      this.setState({ italicStyle: 'normal' });
    }
  }

  handleShowFontPicker() {
    let { showFontPicker } = this.state;
    this.setState({ showFontPicker: !showFontPicker });
  }

  handleFontChange(selectedFont) {
    let { fontFamily } = this.state;
    this.setState({ fontFamily: selectedFont });
  }

  render() {
    let fontsArray = [
      'Arial',
      'Arial Black',
      'Comic Sans MS',
      'cursive',
      'Impact',
      'Charcoal',
      'Lucida Sans Unicode',
      'Times New Roman',
      'Lucida Grande',
      'Tahoma',
      'Geneva',
      'Trebuchet MS',
      'Helvetica',
      'Verdana',
      'Geneva',
      'Courier New',
      'Courier',
      'Lucida Console',
      'Monaco'
    ];

    let { activeProduct } = this.props;
    console.log('activeProduct:', activeProduct);
    let {
      aspectRatio,
      fontSize,
      showTextField,
      textDimensions,
      textCoordinates,
      file,
      fileCoordinates,
      fontFamily,
      showColorPicker,
      showFontPicker,
      boldStyle,
      italicStyle,
      editMode,
      fileDimensions,
      dropzoneActive,
      textColor,
      activeImage,
      errorMessage,
      transformMode,
      colorCount
    } = this.state;
    let dropzoneRef;

    return (
      <div className="pc">
        <div className="pc-container">
          <div className="pc-left">
            <div className="btn-group">
              <div
                className="btn-item"
                onClick={() => {
                  dropzoneRef.open();
                }}
              >
                <i className="fa fa-camera" aria-hidden="true" />
                <p>ARTWORK</p>
              </div>
              <div className="btn-item">
                <i className="fa fa-bomb" aria-hidden="true" />
                <p>DESIGNLIBRARY</p>
              </div>
              <div
                className="btn-item"
                onClick={() => {
                  this.setState({ showTextField: !showTextField });
                }}
              >
                <i className="fa fa-font" aria-hidden="true" />
                <p>TEXT</p>
              </div>
            </div>

            <div className="product-details clearfix">
              <h6 className="title-sm">Project Title</h6>
              <input type="text" className="project-title" ref="projectTitle" defaultValue="Yo Momma's Bounds" />

              <h6 className="description-sm">Description</h6>
              <textarea
                type="text"
                className="project-description"
                ref="projectDescription"
                defaultValue="with a seamless product creation app, Original Thread will definitely take all the heavy lifting and leave you the creative process..."
              />
            </div>
          </div>
          <div className="pc-middle">
            <div
              className="preview"
              style={{
                backgroundImage: `url('${activeImage ? activeImage : ''} ')`
              }}
            >
              <p className={errorMessage ? 'error-text' : 'hide'}>Your graphic is beyond recommended size</p>
              <Dropzone
                disableClick={file || showTextField ? true : false}
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
                  style={file ? { backgroundImage: `url('uploads/${file}')` } : ''}
                  default={{
                    x: fileCoordinates.x,
                    y: fileCoordinates.y,
                    width: fileDimensions.width,
                    height: fileDimensions.height
                  }}
                  size={{ width: fileDimensions.width, height: fileDimensions.height }}
                  position={{ x: fileCoordinates.x, y: fileCoordinates.y }}
                  lockAspectRatio="true"
                  className="background-upload"
                  bounds="parent"
                  onResize={this.handleOnResize.bind(this)}
                  onDragStop={this.handledragged.bind(this)}
                />
              </Dropzone>
              <Rnd
                default={{
                  x: textCoordinates.x,
                  y: textCoordinates.y,
                  width: textDimensions.width,
                  height: textDimensions.height
                }}
                size={{ width: textDimensions.width, height: textDimensions.height }}
                position={{ x: textCoordinates.x, y: textCoordinates.y }}
                lockAspectRatio={aspectRatio}
                bounds="parent"
                className={showTextField ? 'show' : 'hide'}
                onResize={this.handleTextOnResize.bind(this)}
                onDrag={this.handleTextdragged.bind(this)}
              >
                <div className="input-wrapper">
                  <input
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onDoubleClick={this.handleDoubleClick.bind(this)}
                    className={transformMode ? 'text-input bordered' : 'text-input'}
                    type="text"
                    onChange={this.getSize.bind(this)}
                    placeholder="Yo Mama So Fat"
                    style={{ fontSize: fontSize + 'px', color: textColor, fontWeight: boldStyle, fontStyle: italicStyle, fontFamily: fontFamily }}
                  />
                  <i className={transformMode ? 'fa fa-expand' : ''} aria-hidden="true" />
                  <i onClick={this.exitTransformMode.bind(this)} className={transformMode ? 'fa fa-times' : ''} aria-hidden="true" />
                </div>
              </Rnd>
              <Rnd
                default={{
                  x: textCoordinates.x,
                  y: textCoordinates.y + 82,
                  width: 367,
                  height: 40
                }}
                position={{ x: textCoordinates.x, y: textCoordinates.y + 82 }}
                lockAspectRatio="true"
                bounds="parent"
              >
                <div className={editMode ? 'text-transform-group' : 'hide'}>
                  <div onClick={this.handleShowFontPicker.bind(this)} className="font-family">
                    Font Family
                  </div>
                  <div onClick={this.handleBoldStyle.bind(this)} className="bold-style">
                    B
                  </div>
                  <div onClick={this.handleItalicStyle.bind(this)} className="italic-style">
                    I
                  </div>
                  <div onClick={this.handleColorPicker.bind(this)} className="text-color">
                    <div className="text-color-bg" style={{backgroundColor: textColor}} ></div>
                  </div>
                  <div onClick={this.exitEditMode.bind(this)} className="btn-ok">
                    OK
                  </div>
                </div>

                <ChromePicker
                  className={showColorPicker ? 'color-picker' : 'hide'}
                  color={this.state.textColor}
                  onChangeComplete={this.handleChangeComplete.bind(this)}
                />
                <div className={showFontPicker ? 'show' : 'hide'}>
                  <FontPicker fonts={fontsArray} previews={true} activeColor="#64B5F6" value={fontFamily} onChange={this.handleFontChange.bind(this)} />
                </div>
              </Rnd>
            </div>
          </div>
          <div className="pc-right">
            <div className="product-arr-trigger">
              <Link to="/product_array">
                <img src="/images/PRODUCT ARRAY TRIGGER.png" alt="Product Array Trigger" />
              </Link>
              <h5>{activeProduct ? activeProduct.options.title : ''}</h5>
              <p>60% Cotton 30% Polyster</p>
            </div>
            <div className={colorCount < 13 ? 'pc-product-color-group' : 'product-color-group'}>
                {this.colorList()}
            </div>
            <div className="clearfix" />
            <div className="fabric-icons">
                <img className="icon-img" src="/images/Layer 266.png" alt="Fabric Icon 1" />
                <img className="icon-img" src="/images/Layer 265.png" alt="Fabric Icon 2" />
                <img className="icon-img" src="/images/Layer 264.png" alt="Fabric Icon 3" />
                <img className="icon-img" src="/images/Layer 263.png" alt="Fabric Icon 4" />
            </div>
            <div className="fabric-info">
                <h6>magic in the fabric</h6>
                <p>This super-soft, baby-knit t-shirt looks great on both men and women. It is an updated unisex tee, which fits like a well-loved favorite. Made from 100% cotton, except for heather colors, which contain polyester.</p>
                <div className="fabric-info-list">
                  <ul>
                    <li>100% combed and ring-spun cotton</li>
                    <li>Baby-knit jersey</li>
                    <li>Shoulder-to-shoulder taping</li>
                    <li>Cover stitched and hemmed sleeves</li>
                    <li>Side-seamed</li>
                  </ul>
                  <img src="/images/fabric.png" alt="fabric image" />
                </div>
            </div>
          </div>
        </div>
        <div className="decisions">
          <i className="fa fa-refresh" aria-hidden="true" />
          <button className="save-work"> Save Work</button>
          <button type="button" className="publish" onClick={this.handleCreateImage.bind(this)}>
            Publish
          </button>
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