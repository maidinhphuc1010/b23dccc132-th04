import React, { useState, useEffect } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useModel } from 'umi';

interface AddDiplomaFormProps {
	onSuccess: () => void;
	decision?: string;
}

const AddDiplomaForm: React.FC<AddDiplomaFormProps> = ({ onSuccess, decision }) => {
	const history = useHistory();
	const { diplomaInfos, createDiplomaInfo, getDiplomaInfos } = useModel('diploma');

	const [bookNumber, setBookNumber] = useState('');
	const [diplomaNumber, setDiplomaNumber] = useState('');
	const [studentId, setStudentId] = useState('');
	const [fullName, setFullName] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');

	useEffect(() => {
		if (diplomaInfos.length) {
			const maxBookNumber = Math.max(...diplomaInfos.map((d) => Number(d.bookNumber) || 0));
			setBookNumber(String(maxBookNumber + 1).padStart(3, '0'));
		} else {
			setBookNumber('001');
		}
	}, [diplomaInfos]);

	useEffect(() => {
		if (decision && bookNumber) {
			setDiplomaNumber(`${decision}/${bookNumber}`);
		}
	}, [decision, bookNumber]);

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

	const handleSubmit = async (values: any) => {
		try {
			console.log('📝 Dữ liệu submit:', values);
			console.log('📌 bookNumber:', bookNumber);
			console.log('📌 diplomaNumber:', diplomaNumber);

			await createDiplomaInfo({ ...values, bookNumber, diplomaNumber });

			await getDiplomaInfos();

			message.success('Thêm văn bằng thành công!');

			onSuccess();

			return true;
		} catch (error) {
			console.error('❌ Lỗi khi tạo văn bằng:', error);
			message.error('Không thể thêm văn bằng. Vui lòng thử lại!');
			return false;
		}
	};

	return (
		<>
			<Space style={{ marginBottom: 16 }}>
				<Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()}>
					Quay lại
				</Button>
				<ModalForm
					title={`Thêm văn bằng - QĐ: ${decision || 'Không xác định'}`}
					trigger={
						<Button type='primary' icon={<PlusOutlined />}>
							Thêm văn bằng
						</Button>
					}
					onFinish={handleSubmit}
				>
					<ProFormText name='decision' label='Số quyết định' initialValue={decision} disabled />
					<ProFormText name='bookNumber' label='Số vào sổ' initialValue={bookNumber} disabled />
					<ProFormText name='diplomaNumber' label='Số hiệu văn bằng' initialValue={diplomaNumber} disabled />
					<ProFormText
						name='studentId'
						label='Mã sinh viên'
						value={studentId}
						onChange={(e) => setStudentId(e.target.value)}
						rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
					/>
					<ProFormText name='fullName' label='Họ tên' value={fullName} disabled />
				</ModalForm>
			</Space>
		</>
	);
};

export default AddDiplomaForm;
