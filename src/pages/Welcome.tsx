import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Carousel,Image} from 'antd';
import styles from './Welcome.less';



const Welcome:React.FC<{}> = () => {

  return (
    <PageContainer title={false}>
      <Carousel autoplay>
        <div className={styles.image}>
          <Image
            width={1200}
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598878951680&di=dde7eb1e960e272c903f024c3e369cda&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2Fc%2F5716f22b06e93.jpg"
          />
        </div>
        <div className={styles.image}>
          <Image
            width={1200}
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598878951680&di=2d00a94cf134ea494473e95912b7b604&imgtype=0&src=http%3A%2F%2Fpicture.ik123.com%2Fuploads%2Fallimg%2F160812%2F4-160Q2151302.jpg"
          />
        </div>
        <div className={styles.image}>
          <Image
            width={1200}
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1598878951679&di=2eebac4583703edc7b09676ea60491d1&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F1%2F53a15a1343174.jpg"
          />
        </div>
      </Carousel>,
    </PageContainer>
  );
};


export default Welcome;
