import React, { useState } from 'react';
import { Form, Button, Input, Modal} from 'antd';

import { ApiTableItem} from '../data.d';
import {useAccess} from "@@/plugin-access/access";

export interface FormValueType extends Partial<ApiTableItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<ApiTableItem>;
}
const FormItem = Form.Item;


export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    ...props.values,
    target: '0',
    template: '0',
    type: '1',
    time: '',
    frequency: 'month',
  });

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    const roles:Array<string> = fieldsValue.roles.toString().split(',');
    setFormVals({ ...formVals, ...fieldsValue, roles});
    handleUpdate({ ...formVals, ...fieldsValue, roles});
  };

  const access = useAccess();

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="url"
          label="api路径"
          rules={[{ required: true, message: '请输入url！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="name"
          label="api描述"
          rules={[{ required: true, message: '请输入描述！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>

        {access.canAdmin&&(<FormItem
          name="roles"
          label="权限"
          rules={[{ required: true, message: '输入权限！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>)}
        {access.canAdmin&&(<FormItem
        name="remark"
        label="请求模式"
        rules={[{ required: true, message: '输入请求模式！' }]}
        >
        <Input placeholder="请输入" />
        </FormItem>)}
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          提交
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="规则配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >

      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          url: formVals.url,
          roles: formVals.roles,
          remark: formVals.remark,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
