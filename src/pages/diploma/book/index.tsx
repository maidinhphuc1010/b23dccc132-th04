import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiplomaBook } from '@/models/diploma';

const DiplomaBookPage: React.FC = () => {
  const { diplomaBooks, createDiplomaBook } = useModel('diploma');

  const columns: ProColumns<DiplomaBook>[] = [
    {
      title: 'Năm',
      dataIndex: 'year',
      width: 120,
    },
    {
      title: 'Số hiện tại',
      dataIndex: 'currentNumber',
      width: 120,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 180,
      valueType: 'dateTime',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 120,
      render: (_: any) => [
        <Button
          key="view"
          type="link"
          onClick={() => {
            // TODO: Implement view details
          }}
        >
          Xem chi tiết
        </Button>,
      ],
    },
  ];

  const handleCreate = async () => {
    const currentYear = new Date().getFullYear();
    try {
      await createDiplomaBook(currentYear);
      message.success('Tạo sổ văn bằng thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo sổ văn bằng');
    }
  };

  return (
    <PageContainer>
      <ProTable<DiplomaBook>
        headerTitle="Danh sách sổ văn bằng"
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Tạo sổ mới
          </Button>,
        ]}
        columns={columns}
        dataSource={diplomaBooks}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </PageContainer>
  );
};

export default DiplomaBookPage; 