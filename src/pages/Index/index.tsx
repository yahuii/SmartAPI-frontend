import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { List, message } from 'antd';
import { listInterfaceInfoByPageUsingGET } from '@/services/huiapi-backend/interfaceInfoController';
import {addUserInterfaceInfoUsingPOST} from "@/services/huiapi-backend/userInterfaceInfoController";
// import InterfaceInfo = API.InterfaceInfo;

/**
 * 主页
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const handleClick = async (item) => {

    // event.preventDefault(); // 防止默认跳转

    try {
      setLoading(true);
      console.log(1231)
      await addUserInterfaceInfoUsingPOST({
        interfaceInfoId: item.id,
        totalNum: 0,
        leftNum: 20,
        userId: 1,
        status:0,
        method: item.method,
      });
      // 处理数据或进行相应操作
      console.log(item)
    } catch (error) {
      console.error('请求错误:', error);
    } finally {
      setLoading(false);
    }
  };
  const loadData = async (current = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPageUsingGET({
        current,
        pageSize,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="在线接口开放平台">
      <List
        className="my-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item actions={[<a key={item.id}  href={apiLink}
                                    onClick={() => handleClick(item)}
                                  > 查看</a>]}>
              <List.Item.Meta
                title={<a href={apiLink}
                          onClick={() => handleClick(item)}
                >{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          );
        }}
        pagination={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          showTotal(total: number) {
            return '总数：' + total;
          },
          pageSize: 5,
          total,
          onChange(page, pageSize) {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;
