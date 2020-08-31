import React, { useState } from 'react';
import { Form, Button, Input, Modal} from 'antd';

import { UserDetails} from '../data';
import {useAccess} from "@@/plugin-access/access";

export interface FormValueType extends Partial<UserDetails> {
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
  values: Partial<UserDetails>;
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
    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  const access = useAccess();

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="mobile"
          label="手机号"
          rules={[{ required: true, message: '请输入手机号！' }]}
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
        name="frozen"
        label="是否禁用"
        rules={[{ required: true, message: '输入是否禁用！' }]}
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
          mobile: formVals.mobile,
          frozen: formVals.frozen,
          roles: formVals.roles,
          frequency: formVals.frequency,
          email: formVals.email,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
