import { PlusOutlined,UploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Button, message, Tag, Upload ,Radio} from 'antd';
import React, {useState, useRef} from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import {getToken} from "@/services/user";
import {deleteApi, findAllApi, saveApi, downloadApiExcel, updateApi} from "@/pages/api/table/apiServeice";
import {useAccess} from "@@/plugin-access/access";
import CreateForm from './components/CreateForm';
import UpdateForm, {FormValueType} from './components/UpdateForm';
import {ApiTableItem} from './data.d';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields: ApiTableItem) => {
  const hide = message.loading('正在添加');
  try {
    const roles:Array<string> = fields.roles.toString().split(',').map(value => value.trim());
    await saveApi({...fields, roles});
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
  // const role = typeof roles === "string"? [roles]:roles;
  try {
    // @ts-ignore
    await updateApi({...fields});
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};


const handleUpdateMany = async (selectedRows: ApiTableItem[]) => {
  const hide = message.loading('正在配置');
  // const role = typeof roles === "string"? [roles]:roles;
  try {
    // @ts-ignore
    selectedRows.forEach(async (row) => {
      await updateApi(row);
    });
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
const handleRemove = async (selectedRows: ApiTableItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    selectedRows.forEach((row) => {
      deleteApi(row.id);
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
    await downloadApiExcel(filename);
    hide();
    message.success('下载成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('下载失败，请重试');
    return false;
  }
};


const ApiTableList: React.FC<{}> = () => {

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<ApiTableItem[]>([]);
  const [radioValue, setRadioValue] = useState('read');
  const [apiData, setApiData] = useState<ApiTableItem[]>([]);
  const access = useAccess();

  const getApiData = () => {
    return new Promise(function(resolve) {
      const data = apiData.map((value,index) => {return {...value, key:index+1}})
      resolve({data});
    });
  };
  // @ts-ignore
  const columns: ProColumns<ApiTableItem>[] = [
    {
      title: '地址',
      dataIndex: 'url',
      // hideInForm: true,
      valueType: 'textarea',
    },
    {
      title: '接口名称',
      dataIndex: 'name',
    },
    {
      title: '访问模式',
      dataIndex: 'remark',
      valueEnum: {
        'get': { text: 'GET', status: 'Success' },
        'post': { text: 'POST', status: 'Warning' },
        'delete': { text: 'DELETE', status: 'Error' },
        'put': { text: 'PUT', status: 'Processing' },
      },
    },
  ];
  const adminColumns: ProColumns<ApiTableItem>[] = [
    {
      title: '权限',
      dataIndex: 'roles',
      renderText: (roles: Array<string>) => (
        <>
          {
            roles.map((role,index)=>(
              <Tag color="green" key={index+1}>
                {role}
              </Tag>
            ))
          }
        </>
      ),
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
  const updateColumns: ProColumns<ApiTableItem>[] = [
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


  // upload props

  const uploadProps = {
    name: 'file',
    action: 'http://localhost:8080/api/io/upload/url/excel',
    headers: {
      authorization: getToken(),
    },
    showUploadList: false,
    onChange(info:any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        setApiData(info.file.response);
        // @ts-ignore
        actionRef.current?.reloadAndRest();
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };


  return (
    <PageContainer title={false}>
      {access.canAdmin&&(<Radio.Group
        defaultValue="read"
        buttonStyle="solid"
        onChange={(e) => {
          setRadioValue(e.target.value)
          // @ts-ignore
          actionRef.current?.reloadAndRest();
        }}
      >
        <Radio.Button value="read">查询</Radio.Button>
        <Radio.Button value="upload">上传</Radio.Button>
      </Radio.Group>)}
      <ProTable<ApiTableItem>
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
          access.canAdmin && radioValue==='upload' &&(
            <Upload {...uploadProps}
            >
              <Button type="primary">
                <UploadOutlined /> 上传
              </Button>
            </Upload>
          ),
        ]}
        // @ts-ignore
        request={()=>{
          if (radioValue === 'upload'){
            return getApiData();
          }
          return findAllApi();
        }}
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
          {access.canAdmin&& radioValue === 'read' && (<Button
            danger
            type="primary"
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              // @ts-ignore
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>)}
          {access.canAdmin && radioValue === 'upload'&&(<Button
            type="primary"
            onClick={async () => {
              await handleUpdateMany(selectedRowsState);
              setSelectedRows([]);
            }}
          >
            批量新增
          </Button>)}
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<ApiTableItem, ApiTableItem>
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

export default ApiTableList;
