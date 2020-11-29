import {request} from 'umi';
import {downloadFile} from "@/services/user";
import {getHost} from "@/utils/utils";
import {ApiTableItem} from "./data";


export const getToken = () => {
  return `Bearer ${localStorage.getItem('token')}`;
};

export async function findAllApi() {
  return request(`http://${getHost()}/api/url/all`, {
    method: 'get',
    headers:{
      'Authorization': getToken(),
    }
  })
  .then((response) => {
    const data = response.data.map((v:ApiTableItem) => {
      return {...v, key:v.id};
    });
    return {data};
  })
}

export async function findApiByName(username: string) {
  return request(`http://${getHost()}/api/url`, {
    method: 'get',
    headers:{
      'Authorization': getToken(),
    },
    params: {username},
  })
}


export async function saveApi(user: ApiTableItem) {
  return request(`http://${getHost()}/api/url`, {
    method: 'post',
    headers:{
      Accept: 'application/json',
      'Authorization': getToken(),
    },
    data: user,
  })
}

export async function updateApi(data: ApiTableItem) {
  // window.alert(JSON.stringify(data));
  return request(`http://${getHost()}/api/url`, {
    method: 'post',
    headers:{
      'Authorization': getToken(),
    },
    data,
  })
}

export async function deleteApi(id: number) {
  return request(`http://${getHost()}/api/url`, {
    method: 'delete',
    headers:{
      Accept: 'application/json',
      'Authorization': getToken(),
    },
    params: {id},
  })
}



export async function uploadExcel(excel:any) {
  return request(`http://${getHost()}/api/url`, {
    method: 'post',
    headers:{
      'Authorization': getToken(),
    },
    body: excel,
  })
}

export async function downloadApiExcel(filename:string) {
  return request(`http://${getHost()}/api/io/download/url/excel`, {
    method: 'post',
    headers:{
      'Authorization': getToken(),
    },
    responseType: 'arrayBuffer',
  })
  .then(res => {
    const blob = new Blob([res], {type: "application/vnd.ms-excel"});
    downloadFile(blob, filename);
  })
}

