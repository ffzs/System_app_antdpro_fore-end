import { request } from 'umi';
import {UserDetails} from "@/pages/user/table/data";

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}


export async function findAll() {
  const token = `Bearer ${localStorage.getItem('token')}`;
  return request('http://localhost:8080/api/user/all', {
    method: 'get',
    headers:{
      Accept: 'application/json',
      'Authorization': token,
    }
  })
    .then((response) => {
      const data = response.data.map((v:UserDetails) => {
        return {...v, key:v.id};
      });
      return {data};
    }).catch((error) => {
      console.log(error);
    });
}

export async function findByName(username: string) {
  const token = `Bearer ${localStorage.getItem('token')}`;
  return request('http://localhost:8080/api/user', {
    method: 'get',
    headers:{
      Accept: 'application/json',
      'Authorization': token,
    },
    params: {username},
  })
    .then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
}


export async function saveUser(user: UserDetails) {
  const token = `Bearer ${localStorage.getItem('token')}`;
  return request('http://localhost:8080/api/user', {
    method: 'post',
    headers:{
      Accept: 'application/json',
      'Authorization': token,
    },
    data: user,
  })
    .then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
}

export async function updateUser(data: UserDetails) {
  const token = `Bearer ${localStorage.getItem('token')}`;
  return request('http://localhost:8080/api/user', {
    method: 'post',
    headers:{
      Accept: 'application/json',
      'Authorization': token,
    },
    data,
  })
    .then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
}

export async function deleteUserById(id: number) {
  const token = `Bearer ${localStorage.getItem('token')}`;
  return request('http://localhost:8080/api/user', {
    method: 'delete',
    headers:{
      Accept: 'application/json',
      'Authorization': token,
    },
    params: {id},
  })
    .then((response) => {
      return response;
    }).catch((error) => {
      console.log(error);
    });
}


export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
