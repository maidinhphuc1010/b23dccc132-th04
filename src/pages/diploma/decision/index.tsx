import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { GraduationDecision } from '@/models/diploma';
import MyDatePicker from '@/components/MyDatePicker';

const GraduationDecisionPage: React.FC = () => {
  const { graduationDecisions, createGraduationDecision, diplomaBooks } = useModel('diploma');
  const [form] = Form.useForm();

  const columns: ProColumns<GraduationDecision>[] = [
    {
      title: 'Số quyết định',
      dataIndex: 'number',
      width: 150,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issueDate',
      width: 120,
      valueType: 'date',
    },
    {
      title: 'Trích yếu',
      dataIndex: 'summary',
      ellipsis: true,
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'diplomaBookId',
      width: 120,
      render: (_, record) => {
        const book = diplomaBooks.find(b => b.id === record.diplomaBookId);
        return book ? book.year : '-';
      },
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
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

  const handleCreate = async (values: any) => {
    try {
      await createGraduationDecision({
        number: values.number,
        issueDate: values.issueDate.format('YYYY-MM-DD'),
        summary: values.summary,
        diplomaBookId: values.diplomaBookId,
      });
      message.success('Tạo quyết định thành công');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo quyết định');
    }
  };

  return (
    <PageContainer>
      <ProTable<GraduationDecision>
        headerTitle="Danh sách quyết định tốt nghiệp"
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Thêm quyết định mới',
                content: (
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="number"
                      label="Số quyết định"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="issueDate"
                      label="Ngày ban hành"
                      rules={[{ required: true }]}
                    >
                      <MyDatePicker />
                    </Form.Item>
                    <Form.Item
                      name="summary"
                      label="Trích yếu"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                      name="diplomaBookId"
                      label="Sổ văn bằng"
                      rules={[{ required: true }]}
                    >
                      <Input.Select
                        options={diplomaBooks.map(book => ({
                          label: `Năm ${book.year}`,
                          value: book.id,
                        }))}
                      />
                    </Form.Item>
                  </Form>
                ),
                onOk: () => form.submit(),
              });
            }}
          >
            Thêm quyết định
          </Button>,
        ]}
        columns={columns}
        dataSource={graduationDecisions}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </PageContainer>
  );
};

export default GraduationDecisionPage; 