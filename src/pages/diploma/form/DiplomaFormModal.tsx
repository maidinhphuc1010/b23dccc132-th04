import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button } from 'antd';

interface DiplomaFormModalProps {
  visible: boolean;
  form: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
  editingRecord?: any;
}

export const DiplomaFormModal: React.FC<DiplomaFormModalProps> = ({ 
  visible, 
  form, 
  onSubmit, 
  onCancel, 
  onDelete, 
  editingRecord 
}) => {
  const isEditing = !!editingRecord;

  useEffect(() => {
    if (isEditing && editingRecord) {
      form.setFieldsValue(editingRecord);
    } else {
      form.resetFields();
    }
  }, [isEditing, editingRecord, form]);

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa thông tin" : "Thêm trường thông tin"}
      open={visible}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button key="cancel" onClick={() => {
          form.resetFields();
          onCancel();
        }}>
          Hủy
        </Button>,
        isEditing && onDelete && (
          <Button key="delete" danger onClick={onDelete}>
            Xóa
          </Button>
        ),
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {isEditing ? "Cập nhật" : "Thêm"}
        </Button>
      ]}
      destroyOnClose={true}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="fullName" label="Họ và Tên" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="studentId" label="Mã Sinh Viên" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="ethnicity" label="Dân Tộc" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="birthPlace" label="Nơi Sinh" rules={[{ required: true }]}> 
          <Input />
        </Form.Item>
        <Form.Item name="admissionDate" label="Ngày Nhập Học" rules={[{ required: true }]}> 
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="averageRank" label="Điểm Trung Bình" rules={[{ required: true }]}> 
          <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
