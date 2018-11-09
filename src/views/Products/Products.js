import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

// import usersData from './UsersData'

class Products extends Component {
  onAddNew() {
   alert(0)
  }
  render() {

    //const user = usersData.find( user => user.id.toString() === this.props.match.params.id)

    //const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Products</strong>
                <div className="card-header-actions">
                    <a className="card-header-action btn btn-close" onClick={this.onAddNew}><i className="fa fa-plus-square-o"></i></a>
                </div>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    
                    <tbody>
                    {/*
                      {
                        userDetails.map(([key, value]) => {
                          return (
                            <tr key={key}>
                              <td>{`${key}:`}</td>
                              <td><strong>{value}</strong></td>
                            </tr>
                          )
                        })
                      }
                      */}
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Products;
