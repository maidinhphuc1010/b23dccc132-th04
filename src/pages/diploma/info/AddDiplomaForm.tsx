import React, { useState, useEffect } from 'react';
import { ModalForm, ProFormText, ProFormDatePicker } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useModel } from 'umi';

interface AddDiplomaFormProps {
  onSuccess: () => void;
  decision?: string;
}

const AddDiplomaForm: React.FC<AddDiplomaFormProps> = ({ onSuccess, decision }) => {
  const history = useHistory();
  const { diplomaInfos } = useModel('diploma');
  const [bookNumber, setBookNumber] = useState('');
  const [diplomaNumber, setDiplomaNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Tạo số vào sổ tự động
  useEffect(() => {
    const lastBookNumber = diplomaInfos.length
      ? String(Number(diplomaInfos[diplomaInfos.length - 1].bookNumber) + 1).padStart(3, '0')
      : '001';
    setBookNumber(lastBookNumber);
  }, [diplomaInfos]);

  // Cập nhật số hiệu văn bằng khi có số quyết định và số vào sổ
  useEffect(() => {
    if (decision && bookNumber) {
      setDiplomaNumber(`${decision}/${bookNumber}`);
    }
  }, [decision, bookNumber]);

  // Khi nhập mã sinh viên, tự động điền họ tên và ngày sinh nếu có
  useEffect(() => {
    const student = diplomaInfos.find((s) => s.studentId === studentId);
    if (student) {
      setFullName(student.fullName);
      setDateOfBirth(student.dateOfBirth);
    } else {
      setFullName('');
      setDateOfBirth('');
    }
  }, [studentId, diplomaInfos]);

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()}>
          Quay lại
        </Button>
        <ModalForm
          title={`Thêm văn bằng - QĐ: ${decision || 'Không xác định'}`}
          trigger={<Button type="primary" icon={<PlusOutlined />}>Thêm văn bằng</Button>}
          onFinish={async (values) => {
            console.log('Submitted values:', { ...values, bookNumber, diplomaNumber });
            onSuccess();
            return true;
          }}
        >
          {/* Hiển thị số quyết định nhưng không cho chỉnh sửa */}
          <ProFormText name="decision" label="Số quyết định" initialValue={decision} disabled />
          <ProFormText name="bookNumber" label="Số vào sổ" initialValue={bookNumber} disabled />
          <ProFormText name="diplomaNumber" label="Số hiệu văn bằng" initialValue={diplomaNumber} disabled />
          <ProFormText
            name="studentId"
            label="Mã sinh viên"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
          />
          <ProFormText name="fullName" label="Họ tên" value={fullName} disabled />
        </ModalForm>
      </Space>
    </>
  );
};

export default AddDiplomaForm;
