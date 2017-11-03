import React from 'react';
import {Link, IndexLink} from 'react-router';

class Header extends React.Component {
    constructor(props) {
      super(props);
      this.toggleClass= this.toggleClass.bind(this);
      this.state = {
        activeIndex: 0,
        width: '62px',
        left: '-4px',
        display: 'inline-block'
      };

    }

   toggleClass(index, width, left) {
      this.setState({ activeIndex: index });

      if (index < 3 ) {
          this.setState({
            width: width,
            left: left,
            display: 'inline-block'
          });
      } else {
          this.setState({ display: 'none'});
        }
   }

  render() {

    let hrStyles =  {
      left: this.state.left,
      width: this.state.width,
      display: this.state.display
    };

    return (
      <header id="site-header-wrapper">
        <div className="container">
          <div className="clearfix">

            <div className="site-logo">
              <p>ORIGINAL THREAD</p>
              <p>CUSTOM CLOTHIER</p>
            </div>

            <nav className="navigation clearfix">

              <div className="nav-group">
              <hr className="activiated" style={hrStyles} />
                <ul className="nav-element">
                  <li><Link  className={this.state.activeIndex == 0 ? 'active-color': null}  onClick={this.toggleClass.bind(this, 0, '62px', '-4px')} to="#">Create</Link></li>
                  <li><Link  className={this.state.activeIndex == 1 ? 'active-color': null}  onClick={this.toggleClass.bind(this, 1, '46px', '78px')} to="#">Shop</Link></li>
                  <li><Link  className={this.state.activeIndex == 2 ? 'active-color': null}  onClick={this.toggleClass.bind(this, 2, '82px', '152px')} to="#">Campaigns</Link></li>
                  <li><Link to="#"><i className="fa fa-search" aria-hidden="true"></i></Link></li>
                </ul>
                <hr className="linebreak" />
                <ul className="styles">
                  <li><Link className={this.state.activeIndex == 3 ? 'active-color': null} onClick={this.toggleClass.bind(this, 3)} to="#">CASUAL / STREETWEAR</Link></li>
                  <li><Link className={this.state.activeIndex == 4 ? 'active-color': null} onClick={this.toggleClass.bind(this, 4)} to="#">COMPANY</Link></li>
                  <li><Link className={this.state.activeIndex == 5 ? 'active-color': null} onClick={this.toggleClass.bind(this, 5)} to="#">TEAM JERSEYS</Link></li>
                </ul>
                </div>

                <div className="dropdown">
                  <ul>
                    <li><img className="needle" src="/images/needle.png" /></li>
                    <li><img className="bell" src="/images/bell.png" /></li>
                    <li><img className="basket" src="/images/basket.png" /></li>
                    <li><button>Access</button></li>
                  </ul>
                </div>

              </nav>

          </div>
        </div>
      </header>
    )
  }
}

module.exports = Header;