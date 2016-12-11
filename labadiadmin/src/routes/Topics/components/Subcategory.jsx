import React, { PropTypes, Component } from 'react';
import Icon from 'react-mdl/lib/Icon';

class Subcategory extends Component {
  static propTypes = {
    subcat: PropTypes.object.isRequired,
  };

  editImageClicked = () => {
    const avatarReader = this.refs.imgInput;
    avatarReader.addEventListener('change', this.handleFiles, false);
    avatarReader.click();
  };

  handleFiles = (evt) => {
    evt.preventDefault();
    const fileReader = new FileReader();
    const avatar = evt.target.files[0];
    const displayedImage = ReactDOM.findDOMNode(this.refs.imgInput).children[0];

    displayedImage.file = avatar;
    fileReader.onload = (() => () => {
      // aImg.src = e.target.result;
      this.setState({
        avatar,
      });
    })(displayedImage);
    fileReader.readAsDataURL(avatar);
  };


  render() {
    const { subcat } = this.props;
    console.log(subcat);
    const name = subcat.type.split(":")[0];

    return (
      <div className="subcat">
        <div className="subcat_img">
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <div
              style={{
                opacity: 1,
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(${subcat.image})`
              }}>
            </div>
          </div>
        </div>
        <div className="subcat_editicon">
          <Icon name="add_a_photo" onClick={this.editImageClicked} />
          <input type="file" style={{display: 'none'}} ref="imgInput" />
        </div>
        <div className="subcat_title">
          {name}
        </div>
      </div>
    );
  }
}

export default Subcategory;