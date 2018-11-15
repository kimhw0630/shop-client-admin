
import axios from 'axios';
import config from '../config';


export function getProductMenus(fnSuccessCallBack) {
  axios.get(config.APIPath + "/GetProductMenus")
    .then(res => {
      const aList = res.data.Table;
      if (fnSuccessCallBack) {
          fnSuccessCallBack.call(this, aList);
      }
    }).catch(error => {
      
      //return error;
  });
}

export function saveProductMenu(oData, fnSuccessCallBack) {
    axios.post(config.APIPath + "/SaveProductMenu",  oData )
      .then(res => {
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, res.data);
        }
      })
}
export function deleteProductMenu(sId, fnSuccessCallBack) {
    axios.post(config.APIPath + "/DeleteProductMenu/" +   sId)
      .then(res => {
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, res.data);
        }
      })
}

export function getAllCategorys(fnSuccessCallBack) {
  axios.get(config.APIPath + "/GetAllCategorys")
    .then(res => {
      const aList = res.data.Table;
      if (fnSuccessCallBack) {
          fnSuccessCallBack.call(this, aList);
      }
    }).catch(error => {
      
      //return error;
  });
}

export function saveCategory(oData, fnSuccessCallBack) {
    axios.post(config.APIPath + "/SaveCategory",  oData )
      .then(res => {
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, res.data);
        }
      })
}

export function deleteCategory(sId, fnSuccessCallBack) {
    axios.post(config.APIPath + "/DeleteCategory/" +   sId)
      .then(res => {
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, res.data);
        }
      })
}

export function getAllSubCategorys(fnSuccessCallBack) {
  axios.get(config.APIPath + "/GetAllSubCategorys")
    .then(res => {
      const aList = res.data.Table;
      if (fnSuccessCallBack) {
          fnSuccessCallBack.call(this, aList);
      }
    }).catch(error => {
      
      //return error;
  });
}

export function saveSubCategory(oData, fnSuccessCallBack) {
    axios.post(config.APIPath + "/SaveSubCategory",  oData )
      .then(res => {
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, res.data);
        }
      })
}

export function deleteSubCategory(sId, fnSuccessCallBack) {
    axios.post(config.APIPath + "/DeleteSubCategory/" +   sId)
      .then(res => {
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, res.data);
        }
      })
}