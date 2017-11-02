import React from 'react';
import { Link, IndexLink } from 'react-router';

class Footer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <footer id="site-footer">
        <div className="footer-container">
              <div className="footer-headline"><span className="headline">Original Thread. </span>
              Copyright 2017. United States of America</div>
              <nav className="footer-nav">
                <ul>
                  <li><Link to="/terms-of-service">TERMS OF USE</Link></li>
                  <li className="nav-border"><Link to="/privacy-policy">PRIVACY POLICY</Link></li>
                  <li><Link to="/guidelines">GUIDELINES</Link></li>
                  <li><Link to="/customer-care">CUSTOMER CARE</Link></li>
                  <li><Link to="/about">ABOUT US</Link></li>
                  <li><Link to="/contact">CONTACT US</Link></li>
                </ul>
              </nav>
        </div>
      </footer>
    )
  }
}

module.exports = Footer;
