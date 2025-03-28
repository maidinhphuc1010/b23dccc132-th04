import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import type { DiplomaBook } from '@/models/diploma';

const DiplomaBookPage: React.FC = () => {
  const { diplomaBooks, graduationDecisions, createDiplomaBook } = useModel('diploma');

  // Đếm số quyết định trong mỗi sổ văn bằng
  const countDecisions = (bookId: string) => {
    return graduationDecisions.filter(decision => decision.diplomaBookId === bookId).length;
  };

  // Lấy ngày quyết định mới nhất cho mỗi sổ văn bằng
  const getLastDecisionDate = (bookId: string) => {
    const decisions = graduationDecisions
      .filter(decision => decision.diplomaBookId === bookId)
      .map(decision => new Date(decision.issueDate).getTime());

    return decisions.length ? new Date(Math.max(...decisions)).toLocaleDateString() : '-';
  };

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
      render: (_, record) => countDecisions(record.id),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      width: 180,
      render: (_, record) => getLastDecisionDate(record.id),
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          onClick={() => history.push('/diploma/decision')}
        >
          Xem chi tiết
        </Button>,
      ],
    },
  ];

  const handleCreate = async () => {
    const currentYear = new Date().getFullYear();
    try {
      const existingBook = diplomaBooks.find(book => book.year === currentYear);
      if (existingBook) {
        message.warning(`Đã tồn tại sổ văn bằng cho năm ${currentYear}`);
        return;
      }

      const result = await createDiplomaBook(currentYear);
      if (result) {
        message.success('Tạo sổ văn bằng thành công');
      } else {
        message.error('Không thể tạo sổ văn bằng');
      }
    } catch (error: any) {
      console.error('Error creating diploma book:', error);
      message.error(error.message || 'Có lỗi xảy ra khi tạo sổ văn bằng');
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
