import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, Switch, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiplomaFormField, DataType } from '@/models/diploma';

const { Option } = Select;

const DiplomaFormPage: React.FC = () => {
  const { diplomaFormFields, createDiplomaFormField, updateDiplomaFormField, deleteDiplomaFormField } = useModel('diploma');
  const [form] = Form.useForm();

  const columns: ProColumns<DiplomaFormField>[] = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'dataType',
      width: 120,
      render: (_, record) => {
        const typeMap = {
          String: 'Chuỗi',
          Number: 'Số',
          Date: 'Ngày tháng',
        };
        return typeMap[record.dataType] || record.dataType;
      },
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      width: 100,
      render: (_, record) => (
        <Switch checked={record.required} disabled />
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      width: 100,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            Modal.confirm({
              title: 'Chỉnh sửa trường thông tin',
              content: (
                <Form form={form} layout="vertical" initialValues={record}>
                  <Form.Item
                    name="name"
                    label="Tên trường"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="dataType"
                    label="Kiểu dữ liệu"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="String">Chuỗi</Option>
                      <Option value="Number">Số</Option>
                      <Option value="Date">Ngày tháng</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="required"
                    label="Bắt buộc"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    name="order"
                    label="Thứ tự"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} />
                  </Form.Item>
                </Form>
              ),
              onOk: async () => {
                try {
                  const values = await form.validateFields();
                  await updateDiplomaFormField(record.id, values);
                  message.success('Cập nhật thành công');
                } catch (error) {
                  message.error('Có lỗi xảy ra khi cập nhật');
                }
              },
            });
          }}
        >
          Chỉnh sửa
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: 'Xác nhận xóa',
              content: 'Bạn có chắc chắn muốn xóa trường thông tin này?',
              onOk: async () => {
                try {
                  await deleteDiplomaFormField(record.id);
                  message.success('Xóa thành công');
                } catch (error) {
                  message.error('Có lỗi xảy ra khi xóa');
                }
              },
            });
          }}
        >
          Xóa
        </Button>,
      ],
    },
  ];

  const handleCreate = async (values: any) => {
    try {
      await createDiplomaFormField({
        name: values.name,
        dataType: values.dataType,
        required: values.required,
        order: values.order,
      });
      message.success('Thêm trường thông tin thành công');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm trường thông tin');
    }
  };

  return (
    <PageContainer>
      <ProTable<DiplomaFormField>
        headerTitle="Cấu hình biểu mẫu văn bằng"
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Thêm trường thông tin',
                content: (
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="name"
                      label="Tên trường"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="dataType"
                      label="Kiểu dữ liệu"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="String">Chuỗi</Option>
                        <Option value="Number">Số</Option>
                        <Option value="Date">Ngày tháng</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="required"
                      label="Bắt buộc"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                    <Form.Item
                      name="order"
                      label="Thứ tự"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                  </Form>
                ),
                onOk: () => form.submit(),
              });
            }}
          >
            Thêm trường
          </Button>,
        ]}
        columns={columns}
        dataSource={diplomaFormFields}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </PageContainer>
  );
};

export default DiplomaFormPage; 