import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Icon from 'react-mdl/lib/Icon';
import { updateSubcategoryImage } from '../actions'; 

class Subcategory extends Component {
  static propTypes = {
    subcat: PropTypes.object.isRequired,
  };

  state = {
  
  };

  editImageClicked = () => {
    const avatarReader = this.refs.imgInput;
    avatarReader.addEventListener('change', this.handleFiles, false);
    avatarReader.click();
  };

  handleFiles = (evt) => {
    const { dispatch, parentId, subcat: { id } } = this.props;
    evt.preventDefault();
    const fileReader = new FileReader();
    const avatar = evt.target.files[0];
    const displayedImage = ReactDOM.findDOMNode(this.refs.imgContainer);

    fileReader.onloadend = (() => () => {
      displayedImage.style.backgroundImage = `url(${fileReader.result})`;
      const form = new FormData();
      form.append("data", avatar);
      form.append("id", id);

      dispatch(updateSubcategoryImage(form, id, parentId));
    })(displayedImage);
    fileReader.readAsDataURL(avatar);
  };

  // http://labadipics.s3.amazonaws.com/images/admission1.png

  render() {
    const { subcat } = this.props;
    const name = subcat.type.split(':')[0];

    return (
      <div className="subcat">
        <div className="subcat_img">
          <div style={{position: 'relative', width: '100%', height: '100%'}}>
            <div
              ref="imgContainer"
              style={{
                opacity: 1,
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url(http://images.labadipost.com/display?url=${subcat.image}&op=noop)`
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