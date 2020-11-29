import { PlusOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Button, message, Tag } from 'antd';
import React, {useState, useRef} from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import {deleteUserById, downloadExcel, findAll, saveUser, updateUser} from "@/services/user";
import CreateForm from './components/CreateForm';
import UpdateForm, {FormValueType} from './components/UpdateForm';
import {UserDetails} from './data.d';
import {useAccess} from "@@/plugin-access/access";


/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: UserDetails) => {
  const hide = message.loading('正在添加');
  try {
    const defaultUser = {avatar:"http://img.jj20.com/up/allimg/tx26/180814175446490.jpg", password: '123zxc', roles: ['ROLE_USER']};
    const roles:Array<string> = fields.roles.toString().split(',');
    await saveUser({...defaultUser, ...fields, roles});
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  const {id, avatar, password, roles, frozen, mobile, email, username} = fields;
  // const role = typeof roles === "string"? [roles]:roles;
  try {
    // @ts-ignore
    await updateUser({id, avatar, password, roles, frozen, mobile, email, username});
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: UserDetails[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    selectedRows.forEach(async (row) => {
        await deleteUserById(row.id);
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};


const handleDownload = async () => {
  const hide = message.loading('正在下载');
  const filename = `test-${(new Date()).toLocaleDateString()}.xlsx`;
  try {
    await downloadExcel(filename);
    hide();
    message.success('下载成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('下载失败，请重试');
    return false;
  }
};


const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<UserDetails[]>([]);
  const access = useAccess();

  // @ts-ignore
  const columns: ProColumns<UserDetails>[] = [
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInForm: true,
      valueType: 'avatar',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'textarea',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
  ];
  const adminColumns: ProColumns<UserDetails>[] = [
    {
      title: '权限',
      dataIndex: 'roles',
      renderText: (roles: Array<string>) => (
        <>
          {
            roles.map((role,index)=>(
              <Tag color="green" key={index}>
                {role}
              </Tag>
            ))
          }
        </>
      ),
    },
    {
      title: '是否停用',
      dataIndex: 'frozen',
      hideInForm: true,
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '停用', status: 'Error' },
      },
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      hideInForm: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '最近修改人',
      dataIndex: 'lastUpdateBy',
      hideInForm: true,
    },
    {
      title: '创建时间',
      dataIndex: 'lastUpdateTime',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
    },
  ];
  const updateColumns: ProColumns<UserDetails>[] = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
        </>
      ),
    },
  ];
  if (access.canAdmin) {
    columns.push(...adminColumns, ...updateColumns);
  }
  else if (access.canUpload) {
    columns.push(...updateColumns);
  }

  return (
    <PageContainer title={false}>
      <ProTable<UserDetails>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => [access.canAdmin &&
        (<Button type="primary" onClick={() => handleModalVisible(true)}>
          <PlusOutlined /> 新建
        </Button>),
          access.canRead && (
            <Button type="primary" onClick={() => handleDownload()}>
              <CloudDownloadOutlined/> 下载
            </Button>
          ),
        ]}
        request={()=>findAll()}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          {access.canAdmin&&(<Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              // @ts-ignore
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>)}
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<UserDetails, UserDetails>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;
