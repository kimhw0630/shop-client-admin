import React, { Component } from 'react';
import {
  Table, Modal, ModalBody, ModalFooter, ModalHeader,
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

import * as APIHandler from '../../utils/APIHandler';

// import usersData from './UsersData'

class ProductMenus extends Component {

constructor(props) {
    super(props);
    this.state = {
      bShowAddEditDialog: false,
      bShowConfirmDeleteDialog: false,
      aProductMenus: [],
      sSelectedProductMenuName: "",
      sSelectedProductMenuId: 0,
      bEditMode: false
    };
    this.openAddDialog = this.openAddDialog.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.toggleAddEditDialog = this.toggleAddEditDialog.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.handleChangeSelectedProductMenuName = this.handleChangeSelectedProductMenuName.bind(this);
    this.getItems = this.getItems.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.toggleDeleteConfirmDialog = this.toggleDeleteConfirmDialog.bind(this);
    this.onSuccessGetProductMenus = this.onSuccessGetProductMenus.bind(this);
    this.onSuccessSaveItem = this.onSuccessSaveItem.bind(this);
    this.onSuccessDeleteItem = this.onSuccessDeleteItem.bind(this);
  }
  componentDidMount() {
    this.getItems();
  }
  getItems() {
      APIHandler.getProductMenus(this.onSuccessGetProductMenus)
  }
  onSuccessGetProductMenus(aProductMenus) {
    if (aProductMenus) {
      this.setState({aProductMenus:  aProductMenus});
    } else {
       this.setState({aProductMenus:  []});
    }
  }
  saveItem() {
    const oData = {
      productMenuName: this.state.sSelectedProductMenuName,
      productMenuId : this.state.sSelectedProductMenuId
    }
    APIHandler.saveProductMenus(oData, this.onSuccessSaveItem);
    
    this.toggleAddEditDialog();
  }
  onSuccessSaveItem(oData) {
    this.getItems();
  }
  onDeleteItem(oEvent) {
    const sItemId = oEvent.target.getAttribute("data-id");
    this.setState({
      sSelectedProductMenuId: sItemId
    });
    this.toggleDeleteConfirmDialog();
  }
  toggleDeleteConfirmDialog() {
    this.setState({
      bShowConfirmDeleteDialog: !this.state.bShowConfirmDeleteDialog,
    });
  }
  deleteItem() {
    const sId = this.state.sSelectedProductMenuId;
    APIHandler.deleteProductMenu(sId, this.onSuccessDeleteItem);
    this.toggleDeleteConfirmDialog();
  }
  onSuccessDeleteItem() {
    // we should delete from the State not call items..
    this.getItems();
  }
  toggleAddEditDialog() {
    this.setState({
      bShowAddEditDialog: !this.state.bShowAddEditDialog,
    });
  }
  handleChangeSelectedProductMenuName(oEvent) {
    this.setState({sSelectedProductMenuName: oEvent.target.value});
  }
  handleRowClick(oItem) {
    this.setState({
      sSelectedProductMenuName: oItem.productMenuName,
      sSelectedProductMenuId: oItem.productMenuId,
      bEditMode: true
    });
    this.toggleAddEditDialog();
  }
  openAddDialog() {
    this.setState({
      sSelectedProductMenuName: "",
      sSelectedProductMenuId: 0,
      bEditMode: false
    });
    this.toggleAddEditDialog();
  }
  renderTableRow(oItem) {
        // e.g pass parameter 
        const clickCallback = () => this.handleRowClick(oItem);
        return (
          <tr key={"row-data-" + oItem.productMenuId}>
              {/*<td>{oItem.productMenuId}</td>*/}
              <td>{oItem.productMenuName}</td>	
              <td width="100px"><button className="btn btn-ghost-primary btn-sm" onClick={clickCallback}>Edit</button></td>
              <td  width="100px"><button className="btn btn-ghost-danger btn-sm" data-id={oItem.productMenuId} onClick={this.onDeleteItem} >Delete</button></td>
              
          </tr>
        );
    }
  render() {
    // generating rows
    let aTableRows = [];
    this.state.aProductMenus.forEach(oItem => {
        aTableRows.push(this.renderTableRow(oItem));
    });
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={8}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Product Menus</strong>
                 <div className="card-header-actions">
                    <button className="btn btn-ghost-primary btn-sm" onClick={this.openAddDialog}>Add</button>
                </div>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>{aTableRows}</tbody>
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
                    <Label htmlFor="name">Product Menu Name</Label>
                    <Input type="text" id="name" placeholder="Enter product menu name" required  value={this.state.sSelectedProductMenuName} onChange={this.handleChangeSelectedProductMenuName} />
                  </FormGroup>
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveItem}>Ok</Button>{' '}
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
            <Button color="warning" onClick={this.deleteItem}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleDeleteConfirmDialog}>Cancel</Button>
          </ModalFooter>
      </Modal>
      </div>
      

    )
  }
}

export default ProductMenus;