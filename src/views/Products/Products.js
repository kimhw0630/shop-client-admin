import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormText, Row, Table, Label, Input, ModalFooter, Button, Modal, ModalHeader, ModalBody, FormGroup } from 'reactstrap';
import * as APIHandler from '../../utils/APIHandler';
import { runInThisContext } from 'vm';

// import usersData from './UsersData'

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: -1,
      bShowAddEditDialog: false,
      oSelectedItem: {aSelectedSubCategories: []},
      aCompanys: [],
      aFullSubCategorys: []
    }
    this.onEditItem = this.onEditItem.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.getItems = this.getItems.bind(this);
    this.onSuccessGetProductMenus = this.onSuccessGetProductMenus.bind(this);

    this.onEditItem = this.onEditItem.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    
    this.openAddDialog = this.openAddDialog.bind(this);
    this.toggleAddEditDialog = this.toggleAddEditDialog.bind(this);
    this.handleChangeTextField = this.handleChangeTextField.bind(this);
    this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
    this.handleChangeDropDown = this.handleChangeDropDown.bind(this);

    this.getEmptyProduct = this.getEmptyProduct.bind(this);

    this.getCompanys = this.getCompanys.bind(this);
    this.onSuccessgetCompanys = this.onSuccessgetCompanys.bind(this);

    this.getFullSubCategorys = this.getFullSubCategorys.bind(this);
    this.onSuccessgetFullSubCategorys = this.onSuccessgetFullSubCategorys.bind(this);

    this.renderCategorySelector = this.renderCategorySelector.bind(this);
  }
  componentDidMount() {
    this.getItems();
    this.getFullSubCategorys();
  }
  getCompanys() {
    APIHandler.getAllCompanys(this.onSuccessgetCompanys);
  }
  getFullSubCategorys() {
    APIHandler.getFullSubCategorys(this.onSuccessgetFullSubCategorys);
  }
  onSuccessgetFullSubCategorys(aData) {
    if (aData) {
      this.setState({aFullSubCategorys: aData});
    } else {
       this.setState({aFullSubCategorys: []});
    }
  }
  onSuccessgetCompanys(aData) {
    if (aData) {
      this.setState({aCompanys: aData});
    } else {
       this.setState({aCompanys: []});
    }
  }
  getItems() {
      APIHandler.getAllProducts(this.onSuccessGetProductMenus);
  }
  onSuccessGetProductMenus(oData) {

  }
  onEditItem() {

  }
  onSelectItem() {

  }
  onDeleteItem() {

  }
  getEmptyProduct() {
    let oSelectedItem = {};    //creating copy of object
    oSelectedItem.productId = -1;
    oSelectedItem.productName = "";
    oSelectedItem.shortDesc = "";
    oSelectedItem.longDesc = "";
    oSelectedItem.reqularPrice = "";
    oSelectedItem.specialPrice = "";
    oSelectedItem.unitPrice = "";
    oSelectedItem.soldOut = false;
    oSelectedItem.onSale = false;
    oSelectedItem.taxable = true;
    oSelectedItem.sortOrder = "";
    oSelectedItem.aSelectedSubCategories = [];
    return oSelectedItem;
  }
  openAddDialog() {
    this.setState({oSelectedItem : this.getEmptyProduct()});
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
  handleChangeCheckBox(oEvent) {
    const sField =  oEvent.target.getAttribute("data-field");  // data-field e,g, oSelectedProductMenu.sortOrder
    let oSelectedItem = Object.assign({}, this.state.oSelectedItem);    //creating copy of object
    oSelectedItem[sField] = !oSelectedItem[sField];
    this.setState({oSelectedItem : oSelectedItem});
  }
  handleChangeDropDown(oEvent) {
    const sField =  oEvent.target.getAttribute("data-field");  // data-field e,g, oSelectedProductMenu.sortOrder
    const aOptions = oEvent.target.options;
    let aSelectedSubCategories = [];
    for (let i = 0; i < aOptions.length; i++) {
      if (aOptions[i].selected) {
        aSelectedSubCategories.push(aOptions[i].value)
      }
    }
    let oSelectedItem = Object.assign({}, this.state.oSelectedItem); 
    oSelectedItem.aSelectedSubCategories = aSelectedSubCategories;
    this.setState({oSelectedItem: oSelectedItem});
  }
  renderCategorySelector(oItem) {
    const aSelectedSubCategories = this.state.oSelectedItem.aSelectedSubCategories;
    let bSelected = false;
    for (let i = 0; i < aSelectedSubCategories.length; i++ ) {
      if (oItem.fullPathId === aSelectedSubCategories[i]) {
        bSelected = true;
        break;
      }
    }
    return (
      <option key={"row-data-product-" + oItem.fullPathId}  value={oItem.fullPathId}
        selected={bSelected}
        >{oItem.fullPath}</option>
    )
  }
  renderTableRow(oItem) {
    const onClickEditButton = () => this.onEditItem(oItem);
    const onClickTableRow = () => this.onSelectItem(oItem);
    return (
      <tr key={"row-data-product-" + oItem.productId} 
          onClick={onClickTableRow} 
          className={this.state.selectedId === oItem.productId ? 'selected': null}>
          <td>{oItem.productName}</td>	
          <td width="100px"><button className="btn btn-ghost-primary btn-sm" onClick={onClickEditButton}>Edit</button></td>
          <td width="100px">
            <button className="btn btn-ghost-danger btn-sm" 
              data-id={oItem.productId}
              onClick={this.onDeleteItem} >Delete</button>
            </td>
      </tr>
    );
  }
  render() {
    let aTableRows = [];
    if (this.props.itemList) {
      this.props.itemList.forEach(oItem => {
        aTableRows.push(this.renderTableRow(oItem));
      }); 
    }
    let aCategorySelects = [];
    if (this.state.aFullSubCategorys) {
      this.state.aFullSubCategorys.forEach(oItem => {
        aCategorySelects.push(this.renderCategorySelector(oItem));
      }); 
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
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
        <Modal isOpen={this.state.bShowAddEditDialog} toggle={this.toggleAddEditDialog} size="lg"
              className={'modal-primary ' + this.props.className}>
          <ModalHeader toggle={this.toggleAddEditDialog}>Add/Edit</ModalHeader>
          <ModalBody>
            <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input type="text" id="product-name" placeholder="Enter product name" required  
                      data-field="productName" 
                      value={this.state.oSelectedItem.productName} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="product-sortorder">Sort Order</Label>
                    <Input type="number" min="0" max="9999" maxLength="4" id="product-sortorder" placeholder="Sort Order" required 
                      data-field="sortOrder" 
                      value={this.state.oSelectedItem.sortOrder} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                      <Label htmlFor="textarea-shortDesc">Short Description</Label>
                      <Input type="textarea" name="textarea-shortDesc" id="textarea-shortDec" rows="2"
                             placeholder="Short Description..." 
                             data-field="shortDesc" 
                             value={this.state.oSelectedItem.shortDesc} onChange={this.handleChangeTextField}
                             />
                  </FormGroup>
                  <FormGroup>
                      <Label htmlFor="textarea-longDesc">Long Description</Label>
                      <Input type="textarea" name="textarea-longDesc" id="textarea-longDesc" rows="3"
                             placeholder="Long Description..." 
                             data-field="longDesc"
                             value={this.state.oSelectedItem.longDesc} onChange={this.handleChangeTextField}
                             />
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="2">
                      <Label>Price</Label>
                    </Col>
                    <Col xs="2">
                    <Input type="number" id="text-reqularPrice" name="text-input" maxLength="10" 
                      data-field="reqularPrice"
                      value={this.state.oSelectedItem.reqularPrice} onChange={this.handleChangeTextField}/>
                    </Col>
                    <Col xs="2">
                      <Label>Special Price</Label>
                    </Col>
                    <Col xs="2">
                      <Input type="number" id="text-specialPrice" name="text-input" maxLength="10" 
                        data-field="specialPrice"
                        value={this.state.oSelectedItem.specialPrice} onChange={this.handleChangeTextField}/>
                    </Col>
                    <Col xs="2">
                      <Label>Unit Price</Label>
                    </Col>
                    <Col xs="2">
                      <Input type="number" id="text-unitPrice" name="text-input" maxLength="10" 
                        data-field="unitPrice"
                        value={this.state.oSelectedItem.unitPrice} onChange={this.handleChangeTextField}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col xs="4">
                      <FormGroup check inline>
                        <Input className="form-check-input" type="checkbox" id="ck-onSale" name="ck-onSale" 
                          data-field="onSale"
                          defaultChecked={this.state.oSelectedItem.onSale} onChange={this.handleChangeCheckBox}/>
                        <Label check className="form-check-label" htmlFor="ck-onSale">On Sale?</Label>
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                    <FormGroup check inline>
                        <Input className="form-check-input" type="checkbox" id="ck-soldOut" name="ck-soldOut" 
                          data-field="soldOut"
                          defaultChecked={this.state.oSelectedItem.soldOut} onChange={this.handleChangeCheckBox} />
                        <Label check className="form-check-label" htmlFor="ck-soldOut">Sold Out?</Label>
                      </FormGroup>
                    </Col>
                    <Col xs="4">
                    <FormGroup check inline>
                        <Input className="form-check-input" type="checkbox" id="ck-taxable" name="ck-taxable" 
                          data-field="taxable"
                          defaultChecked={this.state.oSelectedItem.taxable} onChange={this.handleChangeCheckBox} />
                        <Label check className="form-check-label" htmlFor="ck-taxable">Taxable?</Label>
                      </FormGroup>
                     
                    </Col>
                  </FormGroup>
                  <FormGroup>
                      <Label htmlFor="ddlCategories">Categories</Label>
                      <Input type="select" name="ddlCategories" id="ddlCategories" onChange={this.handleChangeDropDown} multiple>
                        {aCategorySelects}
                      </Input>
                  </FormGroup>
                  




                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="text-input">Text Input</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="text" id="text-input" name="text-input" placeholder="Text" />
                      <FormText color="muted">This is a help text</FormText>
                    </Col>
                  </FormGroup>
                  
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSave}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddEditDialog}>Cancel</Button>
          </ModalFooter>
      </Modal>


      </div>
    )
  }
}

export default Products;
