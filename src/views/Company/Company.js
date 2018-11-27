import React, { Component } from 'react';
import _ from 'lodash';
import { Card, CardBody, CardHeader, Col, Row, Table, Label, Input, ModalFooter, Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap';
import * as APIHandler from '../../utils/APIHandler';

// import usersData from './UsersData'

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: -1,
      bShowAddEditDialog: false,
      bShowConfirmDeleteDialog: false,
      aItems: [],
      oSelectedItem: {
        companyId: -1,
        companyName: "",
        companyDesc: ""
      }
    }
    this.onEditItem = this.onEditItem.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.getItems = this.getItems.bind(this);
    this.onSuccessGetItems = this.onSuccessGetItems.bind(this);

    this.onEditItem = this.onEditItem.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onDeleteConfirmItem = this.onDeleteConfirmItem.bind(this);
    this.onSuccessDeleteItem = this.onSuccessDeleteItem.bind(this);

    this.onSaveItem = this.onSaveItem.bind(this);
    this.onSuccessSaveItem = this.onSuccessSaveItem.bind(this)
    
    this.openAddDialog = this.openAddDialog.bind(this);
    this.toggleAddEditDialog = this.toggleAddEditDialog.bind(this);
    this.toggleDeleteConfirmDialog = this.toggleDeleteConfirmDialog.bind(this);
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
  }
  componentDidMount() {
    this.getItems();
  }
  sortCompare(a, b) {
    const sA = a.companyName.toUpperCase();
    const sB = b.companyName.toUpperCase();
  
    let comparison = 0;
    if (sA > sB) {
      comparison = 1;
    } else if (sA < sB) {
      comparison = -1;
    }
    return comparison;
  }
  getItems() {
      APIHandler.getAllCompanys(this.onSuccessGetItems);
  }
  onSuccessGetItems(aData) {
    if (aData) {
      this.setState({aItems:  aData});
    } else {
       this.setState({aItems:  []});
    }
  }
  onSaveItem() {
    APIHandler.saveCompany(this.state.oSelectedItem, this.onSuccessSaveItem);
    this.toggleAddEditDialog();
  }
  onSuccessSaveItem(oData) {
    if (oData) {
      let aItems = Object.assign([], this.state.aItems);    //creating copy of object
      if (oData.isNew) {
        aItems.push(oData);
      } else {
        for(let i = 0; i < aItems.length; i++) {
          if (aItems[i].companyId === oData.companyId) {
            aItems[i] = oData;
            break;
          }
        }
      }
      aItems.sort(this.sortCompare);
      this.setState({aItems: aItems});
    }
  }
  onEditItem(oItem) {
    this.setState({
      oSelectedItem: oItem,
      bEditMode: true
    });
    this.toggleAddEditDialog();
  }
  onSelectItem() {

  }
  onDeleteItem(oEvent) {
    let oSelectedItem = Object.assign({}, this.state.oSelectedItem);    //creating copy of object
    oSelectedItem.companyId = oEvent.target.getAttribute("data-id");
    this.setState({
      oSelectedItem: oSelectedItem
    });
    this.toggleDeleteConfirmDialog();
  }
  onDeleteConfirmItem() {
    APIHandler.deleteCompany(this.state.oSelectedItem.companyId, this.onSuccessDeleteItem);
    this.toggleDeleteConfirmDialog();
  }
  onSuccessDeleteItem(oData) {
    if (oData) {
      const aItems =_.filter(this.state.aItems, (o) =>  o.companyId !== oData.deletedId);
      this.setState({aItems: aItems});
    }
  }
  toggleDeleteConfirmDialog() {
    this.setState({
      bShowConfirmDeleteDialog: !this.state.bShowConfirmDeleteDialog,
    });
  }
  openAddDialog() {
    this.setState.oSelectedItem =  {
      companyId: -1,
      companyName: "",
      companyDesc: ""
    }
    this.toggleAddEditDialog();
  }
  toggleAddEditDialog() {
    this.setState({
      bShowAddEditDialog: !this.state.bShowAddEditDialog,
    });
  }
  handleChangeTextField(oEvent) {
    const sField =  oEvent.target.getAttribute("data-field");  // data-field e,g, oSelectedProductMenu.sortOrder
    let oSelectedItem = Object.assign({}, this.state.oSelectedItem);    //creating copy of object
    oSelectedItem[sField] = oEvent.target.value;
    this.setState({oSelectedItem : oSelectedItem});
  }
  renderTableRow(oItem) {
    // e.g pass parameter 
    
    const onClickEditButton = () => this.onEditItem(oItem);
    const onClickTableRow = () => this.onSelectItem(oItem);
    return (
      <tr key={"row-data-company-" + "-" + oItem.companyId} 
          onClick={onClickTableRow} 
          className={this.state.selectedId === oItem.companyId ? 'selected': null}>
          <td>{oItem.companyName}</td>	
          <td width="100px"><button className="btn btn-ghost-primary btn-sm" onClick={onClickEditButton}>Edit</button></td>
          <td width="100px">
            <button className="btn btn-ghost-danger btn-sm" 
              data-id={oItem.companyId}
              onClick={this.onDeleteItem} >Delete</button>
            </td>
      </tr>
    );
  }
  render() {
    let aTableRows = [];
    
    this.state.aItems.forEach(oItem => {
      aTableRows.push(this.renderTableRow(oItem));
    }); 

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Products</strong>
                <div className="card-header-actions">
                    <button className="btn btn-ghost-primary btn-sm" onClick={this.openAddDialog}>Add</button>
                </div>
              </CardHeader>
              <CardBody>
                  <Table responsive hover>
                    <tbody>
                      {aTableRows}
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.bShowAddEditDialog} toggle={this.toggleAddEditDialog}
              className={'modal-primary ' + this.props.className}>
          <ModalHeader toggle={this.toggleAddEditDialog}>Add/Edit</ModalHeader>
          <ModalBody>
            <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label htmlFor="product-name">Comapny Name</Label>
                    <Input type="text" id="company-name" placeholder="Enter Company name" required  
                      data-field="companyName" 
                      value={this.state.oSelectedItem.companyName} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="product-name">Comapny Description</Label>
                    <Input type="text" id="company-desc" placeholder="Enter Company name" required  
                      data-field="companyDesc" 
                      value={this.state.oSelectedItem.companyDesc} onChange={this.handleChangeTextField} />
                  </FormGroup>
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSaveItem}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddEditDialog}>Cancel</Button>
          </ModalFooter>
      </Modal>
      <Modal isOpen={this.state.bShowConfirmDeleteDialog} toggle={this.toggleDeleteConfirmDialog}
              className={'modal-warning ' + this.props.className}>
          <ModalHeader toggle={this.toggleDeleteConfirmDialog}>Warning</ModalHeader>
          <ModalBody>
            <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label >Are you sure you want to delete?</Label>
                  </FormGroup>
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={this.onDeleteConfirmItem}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleDeleteConfirmDialog}>Cancel</Button>
          </ModalFooter>
      </Modal>

      </div>
    )
  }
}

export default Company;
