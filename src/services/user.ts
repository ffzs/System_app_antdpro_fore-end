import {request} from 'umi';
import {UserDetails} from "@/pages/user/table/data";

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export const getToken = () => {
  return `Bearer ${localStorage.getItem('token')}`;
};

export async function findAll() {
  return request('http://localhost:8080/api/user/all', {
    method: 'get',
    headers:{
      'Authorization': getToken(),
    }
  })
  .then((response) => {
    const data = response.map((v:UserDetails) => {
      return {...v, key:v.id};
    });
    return {data};
  })
}

export async function findByName(username: string) {
  return request('http://localhost:8080/api/user', {
    method: 'get',
    headers:{
      Accept: 'application/json',
      'Authorization': getToken(),
    },
    params: {username},
  })
}


export async function saveUser(user: UserDetails) {
  return request('http://localhost:8080/api/user', {
    method: 'post',
    headers:{
      Accept: 'application/json',
      'Authorization': getToken(),
    },
    data: user,
  })
}

export async function updateUser(data: UserDetails) {
  return request('http://localhost:8080/api/user', {
    method: 'post',
    headers:{
      Accept: 'application/json',
      'Authorization': getToken(),
    },
    data,
  })
}

export async function deleteUserById(id: number) {
  return request('http://localhost:8080/api/user', {
    method: 'delete',
    headers:{
      Accept: 'application/json',
      'Authorization': getToken(),
    },
    params: {id},
  })
}



export async function uploadExcel(excel:any) {
  return request('http://localhost:8080/api/user', {
    method: 'post',
    headers:{
      'Authorization': getToken(),
    },
    body: excel,
  })
}

export async function downloadExcel(filename:string) {
  return request('http://localhost:8080/api/io/download/user/excel', {
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


export function downloadFile(blobData: Blob, forDownLoadFileName: string ): any {
  const elink = document.createElement('a');
  elink.download = forDownLoadFileName;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blobData);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}


export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
