import {connect} from 'react-redux'
import React from 'react'
import {addFiles, parseFiles} from '../store/upload'
import {Link} from 'react-router-dom'
import history from '../history'
import Button from '@material-ui/core/Button'

class FileUpload extends React.Component {
  constructor(props) {
    super(props)
    this.handleUploadFiles = this.handleUploadFiles.bind(this)
  }

  handleUploadFiles(ev) {
    ev.preventDefault()

    const data = new FormData()
    for (var i = 0; i < this.uploadInput.files.length; i++) {
      let file = this.uploadInput.files[i]
      data.append('files[' + i + ']', file, file.name)
    }

    this.props.addFiles(data, this.props.user)
  }

  render() {
    return !this.props.files.fileNames.length ? (
      <form onSubmit={this.handleUploadFiles}>
        <div>
          <input
            ref={ref => {
              this.uploadInput = ref
            }}
            type="file"
            multiple
          />
        </div>
        <div>
          {/* <input
            ref={ref => {
              this.fileName = ref
            }}
            type="text"
            placeholder="Enter the desired name of file"
          /> */}
        </div>
        <br />
        <div>
          <Button type="submit" variant="contained" color="primary">
            Upload
          </Button>
        </div>
      </form>
    ) : (
      <div>
        <h2>Files uploaded successfully</h2>
        <button
          type="button"
          onClick={() => {
            this.props.parseFiles(this.props.files, this.props.user)
          }}
        >
          Submit
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  files: state.files,
  user: state.user,
  tableNames: state.files.tableNames
})

const mapDispatchToProps = dispatch => {
  return {
    addFiles: (files, user) => dispatch(addFiles(files, user)),
    parseFiles: (files, user) => {
      dispatch(parseFiles(files, user))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload)
