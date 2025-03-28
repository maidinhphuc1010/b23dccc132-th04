import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Form } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { DiplomaFormModal } from './DiplomaFormModal';
import type { DiplomaInfo } from '@/models/diploma';

interface DiplomaFormPageProps {
  onDataChange: () => void;  // Callback nhận từ parent
}

const DiplomaFormPage: React.FC<DiplomaFormPageProps> = ({ onDataChange }) => {
  const { diplomaInfos, createDiplomaInfo, updateDiplomaInfo } = useModel('diploma');
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DiplomaInfo | null>(null);

  useEffect(() => {
    diplomaInfos.sort((a, b) => (b.averageRank || 0) - (a.averageRank || 0));
  }, [diplomaInfos]);

  const calculateRanking = () => {
    if (!diplomaInfos.length) return [];
    const sorted = [...diplomaInfos].sort((a, b) => (b.averageRank || 0) - (a.averageRank || 0));
    let rank = 1;
    return sorted.map((item, index) => {
      if (index > 0 && item.averageRank !== sorted[index - 1].averageRank) {
        rank = index + 1;
      }
      return { ...item, ranking: rank };
    });
  };

  const handleSave = async (values: DiplomaInfo) => {
    try {
      const isDuplicate = diplomaInfos.some(
        (d) => d.studentId === values.studentId && d.id !== editingRecord?.id
      );

      if (isDuplicate) {
        message.error('Mã sinh viên đã tồn tại');
        return;
      }

      if (editingRecord) {
        await updateDiplomaInfo(editingRecord.id, values);
        message.success('Cập nhật thông tin thành công');
      } else {
        await createDiplomaInfo(values);
        message.success('Thêm thông tin thành công');
      }

      form.resetFields();
      setModalVisible(false);
      setEditingRecord(null);
      
      // Gọi callback để cập nhật dữ liệu cho DiplomaInfoPage
      onDataChange();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const handleEdit = (record: DiplomaInfo) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'Họ và Tên',
      dataIndex: 'fullName',
      width: 200,
    },
    {
      title: 'Mã Sinh Viên',
      dataIndex: 'studentId',
      width: 150,
    },
    {
      title: 'Dân Tộc',
      dataIndex: 'ethnicity',
      width: 150,
    },
    {
      title: 'Nơi Sinh',
      dataIndex: 'birthPlace',
      width: 200,
    },
    {
      title: 'Ngày Nhập Học',
      dataIndex: 'admissionDate',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '—',
    },
    {
      title: 'Xếp Thứ Tự',
      dataIndex: 'ranking',
      width: 120,
      render: (_, record) => record.ranking,
    },
    {
      title: 'Điểm Trung Bình',
      dataIndex: 'averageRank',
      width: 120,
      sorter: (a, b) => (a.averageRank || 0) - (b.averageRank || 0),
      render: (rank: number) => (rank ? rank.toFixed(1) : '—'),
    },
    {
      title: 'Hành Động',
      dataIndex: 'actions',
      width: 150,
      render: (_, record: DiplomaInfo) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Chỉnh Sửa
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<DiplomaInfo>
        headerTitle="Cấu hình biểu mẫu văn bằng"
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              setEditingRecord(null);
              setModalVisible(true);
            }}
          >
            Thêm Thông Tin
          </Button>,
        ]}
        columns={columns}
        dataSource={calculateRanking()}
        pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
      />

      <DiplomaFormModal 
        visible={modalVisible} 
        form={form} 
        onSubmit={handleSave} 
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(null);
        }}
      />
    </PageContainer>
  );
};

export default DiplomaFormPage;
