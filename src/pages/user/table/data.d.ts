
export interface UserDetails {
  key: number;
  username: string;
  avatar: string;
  createBy: string;
  createTime: Date;
  email: string;
  frozen: number;
  id: number;
  lastUpdateBy: string;
  lastUpdateTime: Date;
  mobile: string;
  password: string;
  roles: Array<string>;
}

export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
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
