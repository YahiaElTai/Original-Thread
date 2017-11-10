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

    // let hrStyles =  {
    //   left: this.state.left,
    //   width: this.state.width,
    //   display: this.state.display
    // };
    <ul className="nav-secondary">
      <li><Link className={this.state.activeIndex == 3 ? 'active-color': null} onClick={this.toggleClass.bind(this, 3)} to="#">CASUAL / STREETWEAR</Link></li>
      <li><Link className={this.state.activeIndex == 4 ? 'active-color': null} onClick={this.toggleClass.bind(this, 4)} to="#">COMPANY</Link></li>
      <li><Link className={this.state.activeIndex == 5 ? 'active-color': null} onClick={this.toggleClass.bind(this, 5)} to="#">TEAM JERSEYS</Link></li>
    </ul>

    return (
      <header id="site-header-wrapper">
        <div className="container">
            <div className="site-logo">
              <a href="./"></a>
              <small className="tagline"></small>
            </div>

            <div className="header-menu">
              <nav>
                  <ul className="nav-primary">
                    <li><Link  className={this.state.activeIndex == 0 ? 'active-color': null}  onClick={this.toggleClass.bind(this, 0, '62px', '-4px')} to="#">Create</Link>
                      <ul className="nav-secondary">
                        <li><Link className={this.state.activeIndex == 3 ? 'active-color': null} onClick={this.toggleClass.bind(this, 3)} to="#">CASUAL / STREETWEAR</Link></li>
                        <li><Link className={this.state.activeIndex == 4 ? 'active-color': null} onClick={this.toggleClass.bind(this, 4)} to="#">COMPANY</Link></li>
                        <li><Link className={this.state.activeIndex == 5 ? 'active-color': null} onClick={this.toggleClass.bind(this, 5)} to="#">TEAM JERSEYS</Link></li>
                        <li><a href="#">Test Item 1</a></li>
                        <li><a href="#">Test Item 2</a></li>
                      </ul>
                    </li>
                    <li><Link  className={this.state.activeIndex == 1 ? 'active-color': null}  onClick={this.toggleClass.bind(this, 1, '46px', '78px')} to="#">Shop</Link></li>
                    <li><Link  className={this.state.activeIndex == 2 ? 'active-color': null}  onClick={this.toggleClass.bind(this, 2, '82px', '152px')} to="#">Campaigns</Link></li>
                    <li><Link to="#"><i className="fa fa-search" aria-hidden="true"></i></Link></li>
                  </ul>
              </nav>

              <div className="user-menu">
                <div className="site-notifications">
                  <ul>
                    <li><a href="./" className="ui-toggle"><img className="saved-work" src="/images/needle.png" /></a><div className="counter">23</div></li>
                    <li><a href="./"><img className="ui-toggle" src="/images/bell.png" /></a><div className="counter">433</div></li>
                    <li><a href="./"><img className="ui-toggle" src="/images/basket.png" /></a><div className="counter">2</div></li>
                  </ul>
                </div>
                <div className="account-access">
                  <button>Access</button>
                  <div className="dropdown">Dropdown Content</div>
                  <div className="fader"></div>
                </div>
              </div>
            </div>

          </div>
      </header>
    )
  }
}

module.exports = Header;
