import React, {Component} from 'react'
import {connect} from 'react-redux'
import {orderBy, groupBy, limitTo} from '../store/query'
import Form from 'react-bootstrap/Form'

class QuerySort extends Component {
  constructor() {
    super()
    this.state = {
      groupByArray: [],
      orderByArray: []
    }
    this.toggleGroupBy = this.toggleGroupBy.bind(this)
    this.toggleOrderBy = this.toggleOrderBy.bind(this)
    this.toggleDirection = this.toggleDirection.bind(this)
    this.setLimit = this.setLimit.bind(this)
  }

  toggleGroupBy(ev) {
    let modified = []
    if (this.state.groupByArray.includes(ev.target.value)) {
      modified = this.state.groupByArray.filter(
        field => field !== ev.target.value
      )
      if (this.state.groupByArray) {
        this.setState({groupByArray: modified})
      }
    } else {
      modified = [ev.target.value, ...this.state.groupByArray]
      this.setState({groupByArray: modified})
    }
    this.props.groupBy(this.props.tableName, modified)
  }

  //this needs to be re-worked to preserve order
  toggleOrderBy(ev) {
    let modified = []
    let order = this.state.orderByArray.map(x => Object.keys(x))

    if (order.includes(ev.target.value)) {
      modified = this.state.orderByArray.filter(
        obj => Object.keys(obj) !== ev.target.value
      )
      this.setState({orderByArray: modified})
    } else {
      modified = [{[ev.target.value]: 'ASC'}, ...this.state.orderByArray]
      this.setState({orderByArray: modified})
    }
    this.props.orderBy(this.props.tableName, modified)
  }

  toggleDirection(ev, field) {
    console.log('TARGET.VALUE', ev.target.value)
    console.log('FIELD', field)
    console.log('this.state.orderByArray', this.state.orderByArray)
    let modified = this.state.orderByArray.map(
      obj => Object.keys(obj) === field //WHY AREN'T THE FIELDS MATCHING
    )
    console.log('modified state array', modified)
    let str = /.*/
    let order = this.state.orderByArray
    let hits = this.state.orderByArray.indexOf({[field]: str})
    console.log(hits)
    if (hits >= 0) {
      order[hits] = {[field]: ev.target.value}
      this.setState({orderByArray: [...order]})
    } else if (order.length > 0) {
      order = [...order, {[field]: ev.target.value}]
      this.setState({orderByArray: [...order]})
    }
    this.props.orderBy(this.props.tableName, order)
  }

  setLimit(ev) {
    ev.preventDefault()
    this.props.limitTo(this.props.tableName, ev.target.limit.value)
  }

  render() {
    return (
      <div>
        <Form>
          Group By
          {this.props.queryBundle[this.props.tableName].fields.map(selected => (
            <div key={`inline-${selected}`}>
              <input
                type="checkbox"
                value={selected}
                id={selected}
                onChange={this.toggleGroupBy}
              />
              <label htmlFor={selected}>{selected}</label>
            </div>
          ))}
        </Form>

        <Form>
          Order By
          {this.props.queryBundle[this.props.tableName].fields.map(
            (selected, index) => (
              <div
                key={`inline-${selected}`}
                className="Order-by"
                onClick={e => e.target.focus()}
              >
                <Form.Check
                  type="checkbox"
                  inline
                  value={selected}
                  label={selected}
                  onChange={this.toggleOrderBy}
                />
                <select
                  className="direction-select"
                  name="direction"
                  onChange={ev => this.toggleDirection(ev, selected)}
                >
                  <option value="ASC" />
                  <option value="ASC">ascending</option>
                  <option value="ASC">alphabetical</option>
                  <option value="DESC">descending</option>
                  <option value="DESC">reverse aplh.</option>
                </select>
              </div>
            )
          )}
        </Form>
        <form onSubmit={this.setLimit}>
          Limit results to
          <input name="limit" />
          <button type="submit">Ok</button>
        </form>
      </div>
    )
  }
}

// for disabled checkboxes to appear <Form.Check disabled type="checkbox" label={selected} />

const mapStateToProps = state => ({
  queryBundle: state.queryBundle
})

const mapDispatchToProps = dispatch => {
  return {
    orderBy: (tableName, orderByArray) =>
      dispatch(orderBy(tableName, orderByArray)),
    groupBy: (tableName, groupByArray) =>
      dispatch(groupBy(tableName, groupByArray)),
    limitTo: (tableName, limit) => dispatch(limitTo(tableName, limit))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuerySort)

/*
<Form>
          Group By
          {this.props.queryBundle[this.props.tableName].fields.map(
            (selected) => (
              <Form.Check
                inline
                key={`inline-${selected}`}
                type="checkbox"
                value={selected}
                label={selected}
                onChange={this.toggleGroupBy}
              />
            )
          )}
        </Form>
 */
