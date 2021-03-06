import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button} from '@material-ui/core'
import {
  selectAll,
  unselectAll,
  addFieldElement,
  removeFieldElement
} from '../store/query'

export class SelectAll extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: this.props.selectAllState
    }
  }

  handleClick() {
    if (!this.state.clicked) {
      this.props.selectAll(this.props.tableName)
      this.setState({clicked: true})
      
    } else {
      this.props.unselectAll(this.props.tableName)
      this.setState({clicked: false})
      Object.keys(this.props.table.headers).forEach(field =>
        this.props.removeFieldElement(this.props.tableName, field)
      )
    }
  }

  componentDidUpdate() {
    if (this.props.selectAllState !== this.state.clicked)
      this.setState({clicked: !this.state.clicked})
  }

  render() {
    return (
      <Button
        variant={this.state.clicked ? 'outlined' : 'outlined'}
        color={this.state.clicked ? 'secondary' : 'inherit'}
        onClick={() => this.handleClick()}
      >
        {this.state.clicked ? 'Unselect All Fields' : 'Select All Fields'}
      </Button>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  selectAllState: state.queryBundle[ownProps.tableName].selectAll
})

const mapDispatchToProps = dispatch => ({
  selectAll: tableName => dispatch(selectAll(tableName)),
  unselectAll: tableName => dispatch(unselectAll(tableName)),
  addFieldElement: (tableName, field) =>
    dispatch(addFieldElement(tableName, field)),
  removeFieldElement: (tableName, field) =>
    dispatch(removeFieldElement(tableName, field))
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectAll)
