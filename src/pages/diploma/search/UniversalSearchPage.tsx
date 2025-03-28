import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Input, Select, message } from 'antd';
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';

const { Option } = Select;

const UniversalSearchPage: React.FC = () => {
	const { searchDiplomaInfo, searchGraduationDecision, diplomaInfos, graduationDecisions } = useModel('diploma');
	const [loading, setLoading] = useState(false);
	const [searchType, setSearchType] = useState('diploma');
	const [searchValue, setSearchValue] = useState('');
	const [results, setResults] = useState<any[]>([]);

	const handleSearch = async () => {
		if (!searchValue) {
			message.warning('Vui lòng nhập giá trị tìm kiếm');
			return;
		}
		setLoading(true);
		try {
			let data;
			if (searchType === 'diploma') {
				data = await searchDiplomaInfo({ studentId: searchValue });
			} else if (searchType === 'graduationDecision') {
				data = await searchGraduationDecision({ number: searchValue });
			}
			setResults(data || []);
			message.success('Tìm kiếm thành công');
		} catch (error) {
			message.error('Lỗi khi tìm kiếm');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const columns: ProColumns<any>[] = [
		{
			title: 'Loại dữ liệu',
			dataIndex: 'type',
			width: 150,
			render: (_, record) => (record.studentId ? 'Văn bằng' : 'Quyết định tốt nghiệp'),
		},
		{
			title: 'Số quyết định / Mã SV',
			dataIndex: 'identifier',
			width: 200,
			render: (_, record) => record.number || record.studentId,
		},
		{
			title: 'Tên / Ngày ban hành',
			dataIndex: 'nameOrDate',
			width: 200,
			render: (_, record) => record.fullName || record.issueDate,
		},
		{
			title: 'Thao tác',
			valueType: 'option',
			render: (_, record) => (
				<Button
					type='link'
					onClick={() =>
						history.push(`/diploma/info?${record.number ? `decision=${record.number}` : `student=${record.studentId}`}`)
					}
				>
					Xem chi tiết
				</Button>
			),
		},
	];

	return (
		<PageContainer
			header={{
				title: 'Tìm kiếm tổng hợp',
				extra: [
					<Button key='back' icon={<ArrowLeftOutlined />} onClick={() => history.goBack()}>
						Quay lại
					</Button>,
				],
			}}
		>
			<div style={{ display: 'flex', marginBottom: 16 }}>
				<Select value={searchType} onChange={setSearchType} style={{ width: 200, marginRight: 8 }}>
					<Option value='diploma'>Văn bằng</Option>
					<Option value='graduationDecision'>Quyết định tốt nghiệp</Option>
				</Select>
				<Input
					placeholder='Nhập giá trị tìm kiếm'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					style={{ width: 300, marginRight: 8 }}
				/>
				<Button type='primary' icon={<SearchOutlined />} loading={loading} onClick={handleSearch}>
					Tìm kiếm
				</Button>
			</div>
			<ProTable<any>
				rowKey='id'
				columns={columns}
				dataSource={results}
				search={false}
				pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
			/>
		</PageContainer>
	);
};

export default UniversalSearchPage;
