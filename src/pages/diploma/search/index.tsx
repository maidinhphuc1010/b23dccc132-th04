import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Card, Form, Input, Button, message, Descriptions } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiplomaInfo } from '@/models/diploma';
import MyDatePicker from '@/components/MyDatePicker';

const DiplomaSearchPage: React.FC = () => {
  const { searchDiplomaInfo, diplomaFormFields } = useModel('diploma');
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<DiplomaInfo[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState<DiplomaInfo | null>(null);

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
      title: 'Thao tác',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          onClick={() => setSelectedDiploma(record)}
        >
          Xem chi tiết
        </Button>,
      ],
    },
  ];

  const handleSearch = async (values: any) => {
    const searchParams = {
      diplomaNumber: values.diplomaNumber,
      bookNumber: values.bookNumber,
      studentId: values.studentId,
      fullName: values.fullName,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
    };

    // Check if at least 2 parameters are provided
    const providedParams = Object.values(searchParams).filter(Boolean).length;
    if (providedParams < 2) {
      message.error('Vui lòng nhập ít nhất 2 thông tin tìm kiếm');
      return;
    }

    try {
      const results = await searchDiplomaInfo(searchParams);
      setSearchResults(results);
      if (results.length === 0) {
        message.info('Không tìm thấy thông tin văn bằng');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tìm kiếm');
    }
  };

  const renderCustomFields = (diploma: DiplomaInfo) => {
    return diplomaFormFields.map(field => {
      const value = diploma.customFields[field.id];
      if (value === undefined) return null;

      let displayValue = value;
      if (field.dataType === 'Date') {
        displayValue = new Date(value).toLocaleDateString('vi-VN');
      }

      return (
        <Descriptions.Item key={field.id} label={field.name}>
          {displayValue}
        </Descriptions.Item>
      );
    });
  };

  return (
    <PageContainer>
      <Card title="Tra cứu văn bằng" style={{ marginBottom: 24 }}>
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="diplomaNumber" label="Số hiệu văn bằng">
            <Input placeholder="Nhập số hiệu văn bằng" />
          </Form.Item>
          <Form.Item name="bookNumber" label="Số vào sổ">
            <Input type="number" placeholder="Nhập số vào sổ" />
          </Form.Item>
          <Form.Item name="studentId" label="Mã sinh viên">
            <Input placeholder="Nhập mã sinh viên" />
          </Form.Item>
          <Form.Item name="fullName" label="Họ tên">
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <MyDatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {searchResults.length > 0 && (
        <ProTable<DiplomaInfo>
          headerTitle="Kết quả tìm kiếm"
          rowKey="id"
          search={false}
          columns={columns}
          dataSource={searchResults}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      )}

      {selectedDiploma && (
        <Card title="Chi tiết văn bằng" style={{ marginTop: 24 }}>
          <Descriptions column={2}>
            <Descriptions.Item label="Số vào sổ">{selectedDiploma.bookNumber}</Descriptions.Item>
            <Descriptions.Item label="Số hiệu văn bằng">{selectedDiploma.diplomaNumber}</Descriptions.Item>
            <Descriptions.Item label="Mã sinh viên">{selectedDiploma.studentId}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{selectedDiploma.fullName}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {new Date(selectedDiploma.dateOfBirth).toLocaleDateString('vi-VN')}
            </Descriptions.Item>
            {renderCustomFields(selectedDiploma)}
          </Descriptions>
        </Card>
      )}
    </PageContainer>
  );
};

export default DiplomaSearchPage; 