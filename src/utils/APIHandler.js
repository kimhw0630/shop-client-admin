
import axios from 'axios';
import config from '../config';


export function getProductMenus(fnSuccessCallBack) {
     axios.get(config.APIPath + "/GetProductMenus")
      .then(res => {
        const aProductMenus = res.data.Table;
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, aProductMenus);
        }
      }).catch(error => {
        
        //return error;
    });
  }

export function saveProductMenus(oData, fnSuccessCallBack) {
    axios.post(config.APIPath + "/SaveProductMenu",  oData )
      .then(res => {
        debugger
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this, res.data);
        }
      })
}
export function deleteProductMenu(sId, fnSuccessCallBack) {
    axios.post(config.APIPath + "/DeleteProductMenu/" +   sId)
      .then(res => {
        if (fnSuccessCallBack) {
            fnSuccessCallBack.call(this);
        }
      })
}