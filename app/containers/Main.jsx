import React from 'react';
import Header from 'Header';
import Footer from 'Footer';
import DocumentMeta from 'react-document-meta';

class Main extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      title: '',
      content: ''
    };
  }

  render() {
    const meta = {
      title: 'Original Thread',
      description: 'Original Thread',
      meta: {
        charset: 'utf-8'
      },
      auto: {
        ograph: true
      }
    };

    let pageName = this.props.location.pathname.substr(1).split('/');

    return (
      <div id="main" className={`page-${pageName[0] ? pageName[0] + ' subpage' : 'home'}`}>
        <DocumentMeta {...meta} />
        <Header />
        <div>
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

module.exports = Main;
