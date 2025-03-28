import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { useModel } from 'umi';
import MyDatePicker from '@/components/MyDatePicker';
import dayjs from 'dayjs';

interface GraduationDecisionFormProps {
  visible: boolean;
  onClose: () => void;
}

const GraduationDecisionForm: React.FC<GraduationDecisionFormProps> = ({ visible, onClose }) => {
  const { createGraduationDecision, diplomaBooks, graduationDecisions } = useModel('diploma');
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      const nextNumber = (graduationDecisions?.length || 0) + 1; 
      form.setFieldsValue({ number: `QĐTN${nextNumber.toString().padStart(2, '0')}` });
    }
  }, [visible, graduationDecisions, form]);

  const handleCreate = async (values: any) => {
    try {
      if (!values.issueDate) {
        message.error('Vui lòng chọn ngày ban hành');
        return;
      }

      await createGraduationDecision({
        number: values.number,
        issueDate: dayjs(values.issueDate).format('YYYY-MM-DD'), 
        summary: values.summary,
        diplomaBookId: values.diplomaBookId,
      });

      message.success('Tạo quyết định thành công');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo quyết định:', error);
      message.error('Có lỗi xảy ra khi tạo quyết định');
    }
  };

  return (
    <Modal title="Thêm quyết định mới" open={visible} onCancel={onClose} onOk={() => form.submit()}>
      <Form form={form} layout="vertical" onFinish={handleCreate}>
        <Form.Item name="number" label="Số quyết định">
          <Input disabled />
        </Form.Item>
        <Form.Item name="issueDate" label="Ngày ban hành" rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}> 
          <MyDatePicker />
        </Form.Item>
        <Form.Item name="summary" label="Trích yếu" rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}> 
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="diplomaBookId" label="Sổ văn bằng" rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}> 
          <Select
            options={diplomaBooks.map(book => ({
              label: `Năm ${book.year}`,
              value: book.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GraduationDecisionForm;
