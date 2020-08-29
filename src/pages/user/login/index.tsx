import { Alert, message } from 'antd';
import React, { useState } from 'react';
import {  SelectLang, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
// import logo from '@/assets/logo.svg';
import { LoginParamsType, accountLogin } from '@/services/login';
import LoginFrom from './components/Login';
import styles from './style.less';
import {findAll} from "@/services/user";

const { Username, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await accountLogin({ ...values,  type: 'account'});
      const data = await findAll();

      if (msg.status === 200) {
        message.success('登录成功！');
        localStorage.setItem("token", msg.data.token);
        localStorage.setItem("user", JSON.stringify(msg.data));

        replaceGoto();  // 实现跳转
        setTimeout(() => {  // 刷新initialState
          refresh();
        }, 0);
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState({status: msg.status, type: 'account'});
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.blank}> </div>
        <div className={styles.main}>
          <img
            className={styles.logo}
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597756619654&di=614e6457d19facc70fc19d1a870fd65b&imgtype=0&src=http%3A%2F%2F09.imgmini.eastday.com%2Fmobile%2F20170805%2F20170805232157_105785d2963bb49429d4e5d92acb0368_7.jpeg"
            alt="冰封王座"/>
          <LoginFrom onSubmit={handleSubmit}>
            <div key="account">
              {status === 'error' && loginType === 'account' && !submitting && (
                <LoginMessage content="账户或密码错误（admin/ant.design）" />
              )}

              <Username
                style={{'margin':'0 0 6px 0'}}
                name="username"
                placeholder="用户名: admin"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              />
              <Password
                style={{'margin':'0 0 6px 0'}}
                name="password"
                placeholder="密码: admin"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </div>
            <Submit loading={submitting} style={{'margin':'0 auto'}}>登录</Submit>
          </LoginFrom>
        </div>
      </div>
    </div>
  );
};

export default Login;
