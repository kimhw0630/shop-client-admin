import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

class TableList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedId: 0
    }
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);

  }
  onSelectItem(oItem, sItemId) {
    this.state.selectedId = sItemId
    this.props.onSelectItem(oItem);
  }
  onEditItem(oItem, sItemId) {
    this.props.onEditItem(oItem);
  }
  onDeleteItem(oEvent) {
    this.props.onDeleteItem(oEvent);
  }
  renderTableRow(oItem) {
    // e.g pass parameter 
    
    let sItemName = "";
    let sItemId = "";
    
    if (this.props.itemType === "PRODUCTMENU") {
      sItemName = oItem.productMenuName;
      sItemId = oItem.productMenuId;
    } else if (this.props.itemType === "CATEGORY") {
      sItemName = oItem.categoryName;
      sItemId = oItem.categoryId;
    } else if (this.props.itemType === "SUBCATEGORY") {
      sItemName = oItem.subCategoryName;
      sItemId = oItem.subCategoryId;
    }
    const onClickEditButton = () => this.onEditItem(oItem, sItemId);
    const onClickTableRow = () => this.onSelectItem(oItem, sItemId);
    return (
      <tr key={"row-data-menu-" +  this.props.itemType + "-" + sItemId} 
          onClick={onClickTableRow} 
          className={this.props.selectedItemId === sItemId ? 'selected': null}>

          <td>{sItemName}</td>	
          <td width="100px"><button className="btn btn-ghost-primary btn-sm" onClick={onClickEditButton}>Edit</button></td>
          <td width="100px">
            <button className="btn btn-ghost-danger btn-sm" 
              data-id={sItemId}
              data-type={this.props.itemType}
              onClick={this.onDeleteItem} >Delete</button>
            </td>
      </tr>
    );
  }

  render() {
    let aProductMenuTableRows = [];
    if (this.props.itemList) {
      this.props.itemList.forEach(oItem => {
        aProductMenuTableRows.push(this.renderTableRow(oItem));
      }); 
    }
    return (
      <div>
        <Table responsive hover>
          <tbody>{aProductMenuTableRows}</tbody>
        </Table>
      </div>
    )
  }
}

export default TableList;
