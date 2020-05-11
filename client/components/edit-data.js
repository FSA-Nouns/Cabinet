import React, {Component} from 'react'
import {connect} from 'react-redux'
import {gotTables} from '../store/editData'
import TableExtract from './table-extract'
import SingleTable from './single-table'

export class EditData extends Component {
  // constructor() {
  //     super()
  // }
  componentDidMount() {
    this.props.gotTables(this.props.user.id, this.props.tableNames)
  }

  render() {
    return (
      <div>
        <button
          type="button"
          onClick={() => this.props.history.push('/queryBuilder')}
        >
          Continue
        </button>
        {this.props.tableData.length ? (
          <div>
            <div className="big-container">
              {this.props.tableData.map((table, index) => (
                <div className="single-table" key={index}>
                  <SingleTable
                    tableData={table}
                    tableName={this.props.tableNames[index]}
                    key={index}
                    location={this.props.location}
                  />
                </div>
              ))}
            </div>
            <div className="table-extract-container">
              {this.props.tableData.map((table, index) => (
                <div className="single-table-extract" key={index}>
                  <TableExtract
                    tableData={table}
                    tableName={this.props.tableNames[index]}
                    key={index}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No tables to display</p>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  tableNames: state.files.tableNames,
  tableData: state.tableData
})

const mapDispatchToProps = dispatch => ({
  gotTables: (userId, tables) => {
    dispatch(gotTables(userId, tables))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditData)
