import {request} from "@@/plugin-request/request";
import {getToken} from "@/pages/api/table/apiServeice";


export async function getFlux() {
  return request('http://localhost:8080/api/stream/flux', {
    method: 'get',
    headers:{
      'Authorization': getToken(),
    },
    responseType: "json",
  })
}
