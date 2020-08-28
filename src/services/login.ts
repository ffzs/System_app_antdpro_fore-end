import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function accountLogin(data:LoginParamsType) {

  return request('http://localhost:8080/api/auth/login', {
    method: 'POST',
    data,
  }).then((response) => {
    return response;
  }).catch((error) => {
    console.log(error);
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin(token: string) {
  return request('http://localhost:8080/api/auth/logout', {
    method: 'GET',
    params: {token},
  }).then((response) => {
    return response;
  }).catch((error) => {
    console.log(error);
  });
}