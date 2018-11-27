import React, { Component } from 'react';
import _ from 'lodash';
import {
  Modal, ModalBody, ModalFooter, ModalHeader,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

import * as APIHandler from '../../utils/APIHandler';
import TableList from '../TableList/TableList';

class ProductMenus extends Component {

constructor(props) {
    super(props);
    this.state = {
      aProductMenus: [], // list of Product Menus
      aCategorys: [],     // All list of Categories
      aSubCategorys: [],  // All list of Sub Categories
      
      aFilteredCategorys: [],  // filter categories by same product menu
      aFilteredSubCategorys:[], // filter sub categories by same category 

      bShowAddEditProductMenuDialog: false,  //toggle for Add/Edit product menu dialog
      bShowAddEditCategoryDialog: false,    //toggle for Add/Edit Category dialog
      bShowAddEditSubCategoryDialog: false, //toggle for Add/Edit SubCategory dialog
      bShowConfirmDeleteDialog: false,    //toggle for show delete confirm dialog

      tblSelectedProductMenuId: -1,
      tblSelectedCategory: -1,
      tblSelectedSubCategory: -1,

      bEditMode: false,
      oSelectedProductMenu: {
        productMenuId: -1,
        productMenuName: "",
        sortOrder: 9999
      },
      oSelectedCategory: {
        categoryId: -1,
        categoryName: "",
        productMenuId: 0,
        sortOrder: 9999
      },
      oSelectedSubCategory: {
        subCategoryId: -1,
        subCategoryName: "",
        productMenuId: 0,
        categoryId: 0,
        sortOrder: 9999
      },
      oSelectedDeleteItem: {
        type: "", // productMenu: PRODUCTMENU, category: CATEGORY, subCategory: SUBCATEGORY
        id: -1
      }

    };
    this.openAddDialogForProductMenu = this.openAddDialogForProductMenu.bind(this);
    this.openAddDialogForCategory = this.openAddDialogForCategory.bind(this);
    this.openAddDialogForSubCategory = this.openAddDialogForSubCategory.bind(this);

    this.openEditdilaogForProductMenu = this.openEditdilaogForProductMenu.bind(this);
    this.openEditdilaogForCategory = this.openEditdilaogForCategory.bind(this);
    this.openEditdilaogForSubCategory = this.openEditdilaogForSubCategory.bind(this);

    this.toggleAddEditProductMenuDialog = this.toggleAddEditProductMenuDialog.bind(this);
    this.toggleAddEditCategoryDialog = this.toggleAddEditCategoryDialog.bind(this);
    this.toggleAddEditSubCategoryDialog = this.toggleAddEditSubCategoryDialog.bind(this);

    this.onSaveProductMenu = this.onSaveProductMenu.bind(this);
    this.onSaveCategory = this.onSaveCategory.bind(this);
    this.onSaveSubCategory = this.onSaveSubCategory.bind(this);

    this.handleChangeTextField = this.handleChangeTextField.bind(this);

    this.getItems = this.getItems.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.onDeleteConfirmItem = this.onDeleteConfirmItem.bind(this);

    this.toggleDeleteConfirmDialog = this.toggleDeleteConfirmDialog.bind(this);
    
    this.onSuccessSaveProductMenu = this.onSuccessSaveProductMenu.bind(this);
    this.onSuccessSaveCategory = this.onSuccessSaveCategory.bind(this);
    this.onSuccessSaveSubCategory = this.onSuccessSaveSubCategory.bind(this);

    this.onSuccessDeleteItem = this.onSuccessDeleteItem.bind(this);

    this.onSuccessGetProductMenus = this.onSuccessGetProductMenus.bind(this);
    this.onSuccessGetAllCategorys = this.onSuccessGetAllCategorys.bind(this);
    this.onSuccessGetAllSubCategorys = this.onSuccessGetAllSubCategorys.bind(this);

    this.onClickProductMenuRow = this.onClickProductMenuRow.bind(this);
    this.onClickCategoryRow = this.onClickCategoryRow.bind(this);
    this.onClickSubCategoryRow = this.onClickSubCategoryRow.bind(this);

    this.getEmptyProductMenu = this.getEmptyProductMenu.bind(this);
    this.getEmptyCategory = this.getEmptyCategory.bind(this);
    this.getEmptySubCategory = this.getEmptySubCategory.bind(this);

  }
  componentDidMount() {
    this.getItems();
    this.getCategorys();
    this.getSubCategorys();
  }
  getItems() {
      APIHandler.getProductMenus(this.onSuccessGetProductMenus);
  }
  getCategorys() {
    APIHandler.getAllCategorys(this.onSuccessGetAllCategorys);
  }
  getSubCategorys() {
    APIHandler.getAllSubCategorys(this.onSuccessGetAllSubCategorys);
  }
  onSuccessGetProductMenus(aData) {
    if (aData) {
      this.setState({aProductMenus:  aData});
    } else {
       this.setState({aProductMenus:  []});
    }
  }
  onSuccessGetAllCategorys(aData) {
    if (aData) {
      this.setState({aCategorys:  aData});
    } else {
       this.setState({aCategorys:  []});
    }
  }
  onSuccessGetAllSubCategorys(aData) {
    if (aData) {
      this.setState({aSubCategorys:  aData});
    } else {
       this.setState({aSubCategorys:  []});
    }
  }
  onSaveProductMenu() {
    APIHandler.saveProductMenu(this.state.oSelectedProductMenu, this.onSuccessSaveProductMenu);
    this.toggleAddEditProductMenuDialog();
  }
  onSaveCategory() {
    APIHandler.saveCategory(this.state.oSelectedCategory, this.onSuccessSaveCategory);
    this.toggleAddEditCategoryDialog();
  }
  onSaveSubCategory() {
    APIHandler.saveSubCategory(this.state.oSelectedSubCategory, this.onSuccessSaveSubCategory);
    this.toggleAddEditSubCategoryDialog();
  }
  onSuccessSaveSubCategory(oData) {
    if (oData) {
      let aSubCategorys = Object.assign([], this.state.aSubCategorys);    //creating copy of object
      let aFilteredSubCategorys = Object.assign([], this.state.aFilteredSubCategorys);    //creating copy of object
      if (oData.isNew) {
        aSubCategorys.push(oData);
        aFilteredSubCategorys.push(oData);
      } else {
        for(let i = 0; i < aSubCategorys.length; i++) {
          if (aSubCategorys[i].subCategoryId === oData.subCategoryId) {
            aSubCategorys[i] = oData;
            break;
          }
        }
        for(let i = 0; i < aFilteredSubCategorys.length; i++) {
          if (aFilteredSubCategorys[i].subCategoryId === oData.subCategoryId) {
            aFilteredSubCategorys[i] = oData;
            break;
          }
        }
      }
      aSubCategorys.sort((a, b) => a.sortOrder - b.sortOrder);
      aFilteredSubCategorys.sort((a, b) => a.sortOrder - b.sortOrder);
      this.setState({
        aSubCategorys: aSubCategorys,
        aFilteredSubCategorys: aFilteredSubCategorys
      });
    }
  }
  onSuccessSaveCategory(oData) {
    if (oData) {
      let aCategorys = Object.assign([], this.state.aCategorys);    //creating copy of object
      let aFilteredCategorys = Object.assign([], this.state.aFilteredCategorys);    //creating copy of object
      if (oData.isNew) {
        aCategorys.push(oData);
        aFilteredCategorys.push(oData);
      } else {
        for(let i = 0; i < aCategorys.length; i++) {
          if (aCategorys[i].categoryId === oData.categoryId) {
            aCategorys[i] = oData;
            break;
          }
        }
        for(let i = 0; i < aFilteredCategorys.length; i++) {
          if (aFilteredCategorys[i].categoryId === oData.categoryId) {
            aFilteredCategorys[i] = oData;
            break;
          }
        }
      }
      aCategorys.sort((a, b) => a.sortOrder - b.sortOrder);
      aFilteredCategorys.sort((a, b) => a.sortOrder - b.sortOrder);
      this.setState({
        aCategorys: aCategorys,
        aFilteredCategorys: aFilteredCategorys
      });
    }
  }
  onSuccessSaveProductMenu(oData) {
    if (oData) {
      let aProductMenus = Object.assign([], this.state.aProductMenus);    //creating copy of object
      if (oData.isNew) {
        aProductMenus.push(oData);
      } else {
        for(let i = 0; i < aProductMenus.length; i++) {
          if (aProductMenus[i].productMenuId === oData.productMenuId) {
            aProductMenus[i] = oData;
            break;
          }
        }
      }
      aProductMenus = aProductMenus.sort((a, b) => a.sortOrder - b.sortOrder);
      this.setState({aProductMenus: aProductMenus});
    }
  }
  onDeleteItem(oEvent) {
    let oSelectedDeleteItem = Object.assign({}, this.state.oSelectedDeleteItem);    //creating copy of object
    oSelectedDeleteItem.id = oEvent.target.getAttribute("data-id");
    oSelectedDeleteItem.type = oEvent.target.getAttribute("data-type");
    this.setState({
      oSelectedDeleteItem: oSelectedDeleteItem
    });
    this.toggleDeleteConfirmDialog();
  }
  toggleDeleteConfirmDialog() {
    this.setState({
      bShowConfirmDeleteDialog: !this.state.bShowConfirmDeleteDialog,
    });
  }
  onDeleteConfirmItem() {
    if (this.state.oSelectedDeleteItem.type === "PRODUCTMENU") {
      APIHandler.deleteProductMenu(this.state.oSelectedDeleteItem.id, this.onSuccessDeleteItem);
    } else if (this.state.oSelectedDeleteItem.type === "CATEGORY") {
      APIHandler.deleteCategory(this.state.oSelectedDeleteItem.id, this.onSuccessDeleteItem);
    } else if (this.state.oSelectedDeleteItem.type === "SUBCATEGORY") {
      APIHandler.deleteSubCategory(this.state.oSelectedDeleteItem.id, this.onSuccessDeleteItem);
    }
    this.toggleDeleteConfirmDialog();
  }
  onSuccessDeleteItem(oData) {
    if (oData.deletedType === "PRODUCTMENU") {
      const aProductMenus =_.filter(this.state.aProductMenus, (o) =>  o.productMenuId !== oData.deletedId);
      this.setState({aProductMenus: aProductMenus, oSelectedProductMenu: this.getEmptyProductMenu()});

    } else if (oData.deletedType === "CATEGORY") {
      const aCategorys =_.filter(this.state.aCategorys, (o) =>  o.categoryId !== oData.deletedId);
      const aFilteredCategorys = _.filter(this.state.aFilteredCategorys, (o) =>  o.categoryId !== oData.deletedId);
      this.setState(
        {
          aCategorys: aCategorys,
          aFilteredCategorys: aFilteredCategorys,
          oSelectedCategory: this.getEmptyCategory(this.state.oSelectedProductMenu.productMenuId)
        }
      );

    } else if (oData.deletedType === "SUBCATEGORY") {
      const aSubCategorys =_.filter(this.state.aSubCategorys, (o) =>  o.subCategoryId !== oData.deletedId);
      const aFilteredSubCategorys = _.filter(this.state.aFilteredSubCategorys, (o) =>  o.subCategoryId !== oData.deletedId);
      this.setState(
        {
          aSubCategorys: aSubCategorys,
          aFilteredSubCategorys: aFilteredSubCategorys,
          oSelectedSubCategory: this.getEmptySubCategory(this.state.oSelectedProductMenu.productMenuId, this.state.oSelectedCategory.categoryId)
        }
      );
    }
  }

  toggleAddEditProductMenuDialog() {
    this.setState({
      bShowAddEditProductMenuDialog: !this.state.bShowAddEditProductMenuDialog,
    });
  }
  toggleAddEditCategoryDialog() {
    this.setState({
      bShowAddEditCategoryDialog: !this.state.bShowAddEditCategoryDialog,
    });
  }
  toggleAddEditSubCategoryDialog() {
    this.setState({
      bShowAddEditSubCategoryDialog: !this.state.bShowAddEditSubCategoryDialog,
    });
  }
  handleChangeTextField(oEvent) {
    const sFields =  oEvent.target.getAttribute("data-field");  // data-field e,g, oSelectedProductMenu.sortOrder
    const aFields = sFields.split(".");
    let oSelectedItem = Object.assign({}, this.state[aFields[0]]);    //creating copy of object
    oSelectedItem[aFields[1]] = oEvent.target.value;
    this.setState({[aFields[0]] : oSelectedItem});
  }
  getEmptyProductMenu() {
    let oItem = {};
    oItem.productMenuId = -1;
    oItem.productMenuName = "";
    oItem.sortOrder = 9999;
    return oItem;
  }
  getEmptyCategory(productMenuId) {
    let oItem = {};
    oItem.categoryId = -1;
    oItem.categoryName = "";
    oItem.productMenuId = productMenuId;
    oItem.sortOrder = 9999;
    return oItem;
  }
  getEmptySubCategory(productMenuId, categoryId) {
    let oItem = {};
    oItem.subCategoryId = -1;
    oItem.subCategoryName = "";
    oItem.productMenuId = productMenuId;
    oItem.categoryId = categoryId;
    oItem.sortOrder = 9999;
    return oItem;
  }
  openEditdilaogForProductMenu(oItem) {
    this.setState({
      oSelectedProductMenu: oItem,
      bEditMode: true
    });
    this.toggleAddEditProductMenuDialog();
  }
  openEditdilaogForCategory(oItem) {
    this.setState({
      oSelectedCategory: oItem,
      bEditMode: true
    });
    this.toggleAddEditCategoryDialog();
  }
  openEditdilaogForSubCategory(oItem) {
    this.setState({
      oSelectedSubCategory: oItem,
      bEditMode: true
    });
    this.toggleAddEditSubCategoryDialog();
  }

  openAddDialogForProductMenu() {
    // let oSelectedItem = Object.assign({}, this.state.oSelectedProductMenu);    //creating copy of object
    this.setState({
      oSelectedProductMenu: this.getEmptyProductMenu(),
      bEditMode: false
    });
    this.toggleAddEditProductMenuDialog();
  }
  openAddDialogForCategory() {
    if (this.state.oSelectedProductMenu.productMenuId > -1) {
      this.setState({
        oSelectedCategory: this.getEmptyCategory(this.state.oSelectedProductMenu.productMenuId),
        bEditMode: false
      });
      this.toggleAddEditCategoryDialog();
    }
  }
  openAddDialogForSubCategory() {
    if (this.state.oSelectedProductMenu.productMenuId > -1 && this.state.oSelectedCategory.categoryId > -1 ) {
      this.setState({
        oSelectedSubCategory: this.getEmptySubCategory(this.state.oSelectedProductMenu.productMenuId, this.state.oSelectedCategory.categoryId),
        bEditMode: false
      });
      this.toggleAddEditSubCategoryDialog();
    }
  }
  onClickProductMenuRow(oItem) {
    if (this.state.oSelectedProductMenu.productMenuId !== oItem.productMenuId) {
      const aFilteredCategorys = _.filter(this.state.aCategorys, { productMenuId: oItem.productMenuId });
      this.setState({
        oSelectedProductMenu: oItem,
        oSelectedCategory: this.getEmptyCategory(oItem.productMenuId),
        oSelectedSubCategory: this.getEmptySubCategory(oItem.productMenuId, -1),
        aFilteredCategorys: []
      });
      // if we don't put timeout it add up items in category table
     setTimeout(
          function() {
              this.setState({
                aFilteredCategorys: aFilteredCategorys,
                aFilteredSubCategorys: []
              });
          }.bind(this), 100
        );
    }
  }
  onClickCategoryRow(oItem) {
    if (this.state.oSelectedCategory.categoryId !== oItem.categoryId) {
      const aFilteredSubCategorys = _.filter(this.state.aSubCategorys, { categoryId: oItem.categoryId });
      this.setState({
        oSelectedCategory: oItem,
        oSelectedSubCategory: this.getEmptySubCategory(oItem.productMenuId, -1),
        aFilteredSubCategorys: []
      });
      setTimeout(
          function() {
              this.setState({
                aFilteredSubCategorys: aFilteredSubCategorys
              });
          }.bind(this), 100
        );
    }
    
  }
  onClickSubCategoryRow(oItem) {
    this.setState({oSelectedSubCategory: oItem});
  }
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={4}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Product Menu ({this.state.aProductMenus.length})</strong>
                 <div className="card-header-actions">
                    <button className="btn btn-ghost-primary btn-sm" onClick={this.openAddDialogForCategory}>Add</button>
                </div>
              </CardHeader>
              <CardBody>
                <TableList 
                  itemType="PRODUCTMENU" 
                  itemList={this.state.aProductMenus}
                  selectedItemId={this.state.oSelectedProductMenu.productMenuId}
                  onSelectItem={this.onClickProductMenuRow}
                  onEditItem={this.openEditdilaogForProductMenu}
                  deleteItem={this.onDeleteItem}
                ></TableList>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Category ({this.state.aFilteredCategorys.length})</strong>
                 <div className="card-header-actions">
                    <button className="btn btn-ghost-primary btn-sm" onClick={this.openAddDialogForCategory}>Add</button>
                </div>
              </CardHeader>
              <CardBody>
                <TableList 
                  itemType="CATEGORY" 
                  itemList={this.state.aFilteredCategorys}
                  selectedItemId={this.state.oSelectedCategory.categoryId}
                  onSelectItem={this.onClickCategoryRow}
                  onEditItem={this.openEditdilaogForCategory}
                  onDeleteItem={this.onDeleteItem}
                ></TableList>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Sub Category ({this.state.aFilteredSubCategorys.length})</strong>
                 <div className="card-header-actions">
                    <button className="btn btn-ghost-primary btn-sm" onClick={this.openAddDialogForSubCategory}>Add</button>
                </div>
              </CardHeader>
              <CardBody>
                <TableList 
                  itemType="SUBCATEGORY" 
                  itemList={this.state.aFilteredSubCategorys}
                  selectedItemId={this.state.oSelectedSubCategory.subCategoryId}
                  onSelectItem={this.onClickSubCategoryRow}
                  onEditItem={this.openEditdilaogForSubCategory}
                  onDeleteItem={this.onDeleteItem}
                ></TableList>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* Dialog for Product Menu */}
        <Modal isOpen={this.state.bShowAddEditProductMenuDialog} toggle={this.toggleAddEditProductMenuDialog}
              className={'modal-primary ' + this.props.className}>
          <ModalHeader toggle={this.toggleAddEditProductMenuDialog}>Add/Edit</ModalHeader>
          <ModalBody>
            <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label htmlFor="product-name">Product Menu Name</Label>
                    <Input type="text" id="product-name" placeholder="Enter product menu name" required  data-field="oSelectedProductMenu.productMenuName" value={this.state.oSelectedProductMenu.productMenuName} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="product-sortorder">Sort Order</Label>
                    <Input type="number" min="0" max="9999" maxLength="4" id="product-sortorder" placeholder="Sort Order" required data-field="oSelectedProductMenu.sortOrder" value={this.state.oSelectedProductMenu.sortOrder} onChange={this.handleChangeTextField} />
                  </FormGroup>
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSaveProductMenu}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddEditProductMenuDialog}>Cancel</Button>
          </ModalFooter>
      </Modal>
      {/* Dialog for Category */}
      <Modal isOpen={this.state.bShowAddEditCategoryDialog} toggle={this.toggleAddEditCategoryDialog}
              className={'modal-primary ' + this.props.className}>
          <ModalHeader toggle={this.toggleAddEditCategoryDialog}>Add/Edit</ModalHeader>
          <ModalBody>
            <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input type="text" id="category-name" placeholder="Enter category name" required  
                      data-field="oSelectedCategory.categoryName" 
                      value={this.state.oSelectedCategory.categoryName} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="category-sortOrder">Sort Order</Label>
                    <Input type="number" min="0" max="9999" maxLength="4" id="category-sortOrder" placeholder="Sort Order" required 
                      data-field="oSelectedCategory.sortOrder" 
                      value={this.state.oSelectedCategory.sortOrder} onChange={this.handleChangeTextField} />
                  </FormGroup>
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSaveCategory}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddEditCategoryDialog}>Cancel</Button>
          </ModalFooter>
      </Modal>
       {/* Dialog for Sub Category */}
      <Modal isOpen={this.state.bShowAddEditSubCategoryDialog} toggle={this.toggleAddEditSubCategoryDialog}
              className={'modal-primary ' + this.props.className}>
          <ModalHeader toggle={this.bShowAddEditSubCategoryDialog}>Add/Edit</ModalHeader>
          <ModalBody>
            <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label htmlFor="category-name">Sub Category Name</Label>
                    <Input type="text" id="subcategory-name" placeholder="Enter Sub Category name" required  
                      data-field="oSelectedSubCategory.subCategoryName" 
                      value={this.state.oSelectedSubCategory.subCategoryName} onChange={this.handleChangeTextField} />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="subcategory-sortOrder">Sort Order</Label>
                    <Input type="number" min="0" max="9999" maxLength="4" id="subcategory-sortOrder" placeholder="Sort Order" required 
                      data-field="oSelectedSubCategory.sortOrder" 
                      value={this.state.oSelectedSubCategory.sortOrder} onChange={this.handleChangeTextField} />
                  </FormGroup>
                </Col>
              </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onSaveSubCategory}>Ok</Button>{' '}
            <Button color="secondary" onClick={this.toggleAddEditSubCategoryDialog}>Cancel</Button>
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

export default ProductMenus;