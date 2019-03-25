import React, { Component} from 'react';
import { Text } from 'react-native';

class StyledText extends Component {
  setFontType = (type) => {
    switch(type){
      case 'bold':
        return 'caviar-dreams-bold';
      case 'italic':
        return 'caviar-dreams-italic';
      case 'bold-italic':
        return 'caviar-dreams-bold-italic';
      default:
        return 'caviar-dreams';
    }
  };

  render() {
    const font = this.setFontType(this.props.type ? this.props.type : 'normal');
    const style = [{ fontFamily: font}, this.props.style || {}];
    const allProps = Object.assign({}, this.props, {styles:style});
    return <Text {...allProps}> {this.props.children}</Text>;
  }
}


export default StyledText