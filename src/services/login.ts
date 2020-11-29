import { request } from 'umi';
import {getHost} from "@/utils/utils";

export interface LoginParamsType {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/api/login/account', {
    method: 'post',
    data: params,
  });
}

export async function accountLogin(data:LoginParamsType) {
  return request(`http://${getHost()}/api/auth/login`, {
    method: 'post',
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
  return request(`http://${getHost()}/api/auth/logout`, {
    method: 'get',
    params: {token},
  }).then((response) => {
    return response;
  }).catch((error) => {
    console.log(error);
  });
}
