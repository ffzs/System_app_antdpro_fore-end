import React, {useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, List, Button} from 'antd';
import {findAll} from "@/services/user";
// import styles from './Welcome.less';
import {UserDetails} from "@/pages/user/table/data";


const Welcome:React.FC<{}> = () => {
  const [users, setUsers] = useState<Array<string>>([]);

  const clink = async () => {
    const {data} = await findAll();
    const userList:Array<UserDetails> = data;
    const info:Array<string> = userList.map((v:UserDetails) => JSON.stringify(v));;
    setUsers(info);
  };

  return (
    <PageContainer title={false}>
      <List
        bordered
        dataSource={users}
        renderItem={item => (
          <List.Item>
            <Typography.Text mark>[ITEM]</Typography.Text> {item}
          </List.Item>
        )}
      />
      <Button onClick={clink} type="primary" >data</Button>
    </PageContainer>
  );
};


export default Welcome;
