
export interface ApiTableItem {
  key: number;
  id: number;
  name: string;
  url: string;
  remark: string;
  createBy: string;
  createTime: Date;
  lastUpdateBy: string;
  lastUpdateTime: Date;
  roles: Array<string>;
}


export interface TableListParams {
  status?: string;
  email?: string;
  status?: string;
  username?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
