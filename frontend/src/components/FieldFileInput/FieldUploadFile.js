import React, { Component } from 'react'
import Spinner from './Spinner'
import Images from './Images'
import Buttons from './Buttons'
import axios from 'axios'
import {BACKEND_URL} from '../../utils'

export default class App extends Component {
  
  state = {
    uploading: false,
    images: []
  }

  onChange = e => {
    const file = e.target.files[0]
    this.setState({ uploading: true })

    const formData = new FormData()

    console.log(file)
    formData.append("file", file);
    axios({
        method: 'post',
        url: BACKEND_URL + '/api/files',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(res => {
        console.log(res)
      this.setState({ 
        uploading: false,
        images: [...this.state.images].concat(res.data)
      })
      this.props.addFileURLToState(res.data.secure_url)
    })
  }

  removeImage = id => {
    this.setState({
      images: this.state.images.filter(image => image.url !== id)
    })
  }
  
  render() {
    //const { uploading, images } = this.state
    let content = <Buttons onChange={this.onChange} />
    if (this.state.images.length > 0) {
        content = <Images images={this.state.images} removeImage={this.removeImage} />
    } else if (this.state.uploading) {
        content = <Spinner />
    }


    return (
      <div>
        <div className='buttons'>
            {this.state.images.length > 0 ? '' : 'Please upload your car picture.'}
            {content}
        </div>
      </div>
    )
  }
}