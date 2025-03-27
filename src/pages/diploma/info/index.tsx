import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiplomaInfo } from '@/models/diploma';
import MyDatePicker from '@/components/MyDatePicker';

const DiplomaInfoPage: React.FC = () => {
  const { diplomaInfos, createDiplomaInfo, graduationDecisions, diplomaFormFields } = useModel('diploma');
  const [form] = Form.useForm();

  const columns: ProColumns<DiplomaInfo>[] = [
    {
      title: 'Số vào sổ',
      dataIndex: 'bookNumber',
      width: 100,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'diplomaNumber',
      width: 150,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      width: 200,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      width: 120,
      valueType: 'date',
    },
    {
      title: 'Quyết định tốt nghiệp',
      dataIndex: 'graduationDecisionId',
      width: 150,
      render: (_, record) => {
        const decision = graduationDecisions.find(d => d.id === record.graduationDecisionId);
        return decision ? decision.number : '-';
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

  const renderCustomFields = () => {
    return diplomaFormFields.map(field => {
      switch (field.dataType) {
        case 'String':
          return (
            <Form.Item
              key={field.id}
              name={['customFields', field.id]}
              label={field.name}
              rules={[{ required: field.required }]}
            >
              <Input />
            </Form.Item>
          );
        case 'Number':
          return (
            <Form.Item
              key={field.id}
              name={['customFields', field.id]}
              label={field.name}
              rules={[{ required: field.required }]}
            >
              <Input type="number" />
            </Form.Item>
          );
        case 'Date':
          return (
            <Form.Item
              key={field.id}
              name={['customFields', field.id]}
              label={field.name}
              rules={[{ required: field.required }]}
            >
              <MyDatePicker />
            </Form.Item>
          );
        default:
          return null;
      }
    });
  };

  const handleCreate = async (values: any) => {
    try {
      await createDiplomaInfo({
        diplomaNumber: values.diplomaNumber,
        studentId: values.studentId,
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
        graduationDecisionId: values.graduationDecisionId,
        customFields: values.customFields || {},
      });
      message.success('Thêm thông tin văn bằng thành công');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm thông tin văn bằng');
    }
  };

  return (
    <PageContainer>
      <ProTable<DiplomaInfo>
        headerTitle="Danh sách thông tin văn bằng"
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Thêm thông tin văn bằng',
                content: (
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="diplomaNumber"
                      label="Số hiệu văn bằng"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="studentId"
                      label="Mã sinh viên"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="fullName"
                      label="Họ tên"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="dateOfBirth"
                      label="Ngày sinh"
                      rules={[{ required: true }]}
                    >
                      <MyDatePicker />
                    </Form.Item>
                    <Form.Item
                      name="graduationDecisionId"
                      label="Quyết định tốt nghiệp"
                      rules={[{ required: true }]}
                    >
                      <Select
                        options={graduationDecisions.map(decision => ({
                          label: decision.number,
                          value: decision.id,
                        }))}
                      />
                    </Form.Item>
                    {renderCustomFields()}
                  </Form>
                ),
                onOk: () => form.submit(),
              });
            }}
          >
            Thêm văn bằng
          </Button>,
        ]}
        columns={columns}
        dataSource={diplomaInfos}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </PageContainer>
  );
};

export default DiplomaInfoPage; 