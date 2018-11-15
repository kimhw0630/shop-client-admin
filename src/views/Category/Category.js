import React, { Component } from 'react';
import {
  Table, Modal, ModalBody, ModalFooter, ModalHeader,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
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

class Category extends Component {

constructor(props) {
    super(props);
    this.state = {
      bShowAddEditDialog: false,
      bShowConfirmDeleteDialog: false,
      bIsDDLProductMenuOpen: false,
      aItems: [],
      aProductItems: [],
      sSelectedProductMenuName: "",
      sSelectedProductMenuId: 0,
      sSelectedSortOrder: 9999,
      bEditMode: false,
      selectedItem: {
        categoryId: 0,
        categoryName: "",
        categoryDesc: "",
        productMenuId: 0,
        productMenuName: "",
        sortOrder: 9999,
      }
    };
    this.openAddDialog = this.openAddDialog.bind(this);
    this.openEditDialog = this.openEditDialog.bind(this);
    this.toggleAddEditDialog = this.toggleAddEditDialog.bind(this);
    this.toggleDDLProductMenu = this.toggleDDLProductMenu.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
    this.getItems = this.getItems.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.toggleDeleteConfirmDialog = this.toggleDeleteConfirmDialog.bind(this);
    this.onSuccessGetItems = this.onSuccessGetItems.bind(this);
    this.onSuccessSaveItem = this.onSuccessSaveItem.bind(this);
    this.onSuccessDeleteItem = this.onSuccessDeleteItem.bind(this);
    this.onSuccessGetProductMenus = this.onSuccessGetProductMenus.bind(this);
    this.onSelectDDLProductMenuItem = this.onSelectDDLProductMenuItem.bind(this);
    this.renderDDLProductMenuItem = this.renderDDLProductMenuItem.bind(this);
  }
  componentDidMount() {
    this.getProductMenus();
  }
  getProductMenus() {
    APIHandler.getProductMenus(this.onSuccessGetProductMenus)
  }
  onSuccessGetProductMenus(aItems) {
    if (aItems) {
      this.setState({aProductItems: aItems});
      this.getItems();
    } else {
       this.setState({aProductItems: []});
    }
  }
  getItems() {
      APIHandler.getAllCategorys(this.onSuccessGetItems)
  }
  onSuccessGetItems(aItems) {
    if (aItems) {
      this.setState({aItems: aItems});
    } else {
       this.setState({aItems: []});
    }
  }
  saveItem() {
    APIHandler.saveCategory(this.state.selectedItem, this.onSuccessSaveItem);
    this.toggleAddEditDialog();
  }
  onSuccessSaveItem(oData) {
    this.getItems();
  }
  onDeleteItem(oEvent) {
    const sItemId = oEvent.target.getAttribute("data-id");
    let oSelectedItem = Object.assign({}, this.state.selectedItem);   //creating copy of object
    oSelectedItem.categoryId =  sItemId;                              //updating value
    this.setState({selectedItem : oSelectedItem});
    this.toggleDeleteConfirmDialog();
  }
  toggleDeleteConfirmDialog() {
    this.setState({
      bShowConfirmDeleteDialog: !this.state.bShowConfirmDeleteDialog,
    });
  }
  deleteItem() {
    const sId = this.state.selectedItem.categoryId;
    APIHandler.deleteCategory(sId, this.onSuccessDeleteItem);
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
  toggleDDLProductMenu() {
    this.setState({
      bIsDDLProductMenuOpen: !this.state.bIsDDLProductMenuOpen,
    });
  }
  handleChangeTextField(oEvent) {
    const sField =  oEvent.target.getAttribute("data-field");
    let oSelectedItem = Object.assign({}, this.state.selectedItem);    //creating copy of object
    oSelectedItem[sField] = oEvent.target.value;
    this.setState({selectedItem: oSelectedItem});
  }
  openEditDialog(oItem) {

    this.setState({selectedItem: oItem});
    this.toggleAddEditDialog();
  }
  openAddDialog() {
    let oSelectedItem = Object.assign({}, this.state.selectedItem);    //creating copy of object
    oSelectedItem.categoryId =  -1;                      //updating value
    oSelectedItem.categoryName =  "";
    oSelectedItem.categoryDesc = "";
    oSelectedItem.productMenuId = 0;
    oSelectedItem.productMenuName = "";
    oSelectedItem.sortOrder = 9999;
    this.setState({selectedItem : oSelectedItem});
    this.toggleAddEditDialog();
  }
  onSelectDDLProductMenuItem(oItem) {
    let oSelectedItem = Object.assign({}, this.state.selectedItem);    //creating copy of object
    oSelectedItem.productMenuId = oItem.productMenuId;
    oSelectedItem.productMenuName = oItem.productMenuName;
    this.setState({selectedItem : oSelectedItem});
  }
  renderTableRow(oItem) {
    // e.g pass parameter 
    const clickCallback = () => this.openEditDialog(oItem);
    return (
      <tr key={"row-data-" + oItem.categoryId}>
          {/*<td>{oItem.productMenuId}</td>*/}
          <td>{oItem.categoryName}</td>	
          <td>{oItem.productMenuName}</td>	
          <td width="100px">{oItem.sortOrder}</td>
          <td width="100px"><button className="btn btn-ghost-primary btn-sm" onClick={clickCallback}>Edit</button></td>
          <td width="100px"><button className="btn btn-ghost-danger btn-sm" data-id={oItem.categoryId} onClick={this.onDeleteItem} >Delete</button></td>
      </tr>
    );
  }
  renderDDLProductMenuItem(oItem) {
    const clickCallBack = () => this.onSelectDDLProductMenuItem(oItem)
    return (
        <DropdownItem key={"ddl-data-" + oItem.productMenuId} onClick={clickCallBack}>{oItem.productMenuName}</DropdownItem>
    );
  }

  render() {
    // generating rows
    let aTableRows = [];
    this.state.aItems.forEach(oItem => {
        aTableRows.push(this.renderTableRow(oItem));
    });
    let aDDLItems = [];
    this.state.aProductItems.forEach(oItem => {
      aDDLItems.push(this.renderDDLProductMenuItem(oItem));
    });
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={8}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Category</strong>
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
        {/* Add Dialog */}
        <Modal isOpen={this.state.bShowAddEditDialog} toggle={this.toggleAddEditDialog}
              className={'modal-primary ' + this.props.className}>
          <ModalHeader toggle={this.toggleAddEditDialog}>Add/Edit</ModalHeader>
          <ModalBody>
            <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label htmlFor="categoryName">Product Menu</Label>
                    <Dropdown isOpen={this.state.bIsDDLProductMenuOpen} toggle={this.toggleDDLProductMenu}>
                      <DropdownToggle caret>
                        {this.state.selectedItem.productMenuName || "Select Product Menu" }
                      </DropdownToggle>
                      <DropdownMenu>
                        {aDDLItems}
                      </DropdownMenu>
                    </Dropdown>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input type="text" id="categoryName" placeholder="Enter category name" required data-field="categoryName" value={this.state.selectedItem.categoryName} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="categoryDesc">Category Description</Label>
                    <Input type="text" id="categoryDesc" placeholder="Enter category description" required  data-field="categoryDesc" value={this.state.selectedItem.categoryDesc} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input type="number" min="0" max="9999" maxLength="4" id="sortOrder" placeholder="Sort Order" required  data-field="sortOrder" value={this.state.selectedItem.sortOrder} onChange={this.handleChangeTextField} />
                  </FormGroup>
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveItem}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddEditDialog}>Cancel</Button>
          </ModalFooter>
      </Modal>
      {/* Delete Confirm Dialog */}
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

export default Category;