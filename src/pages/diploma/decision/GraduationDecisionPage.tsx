import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import type { GraduationDecision } from '@/models/diploma';
import GraduationDecisionForm from './GraduationDecisionForm';

const GraduationDecisionPage: React.FC = () => {
	const { graduationDecisions, diplomaBooks, searchGraduationDecision } = useModel('diploma');
	const [modalVisible, setModalVisible] = useState(false);
	const [searchCount, setSearchCount] = useState(0);
	const [decisionSearchCounts, setDecisionSearchCounts] = useState<Record<string, number>>({});

	const handleSearch = async (params: any) => {
		try {
			await searchGraduationDecision(params);
			setSearchCount((prev) => prev + 1);
			message.info(`Tổng số lần tìm kiếm: ${searchCount + 1}`);

			if (params.number) {
				setDecisionSearchCounts((prev) => ({
					...prev,
					[params.number]: (prev[params.number] || 0) + 1,
				}));
			}
		} catch (error) {
			console.error('Lỗi khi tìm kiếm quyết định:', error);
		}
	};

	const columns: ProColumns<GraduationDecision>[] = [
		{
			title: 'Số quyết định',
			dataIndex: 'number',
			width: 150,
		},
		{
			title: 'Số lần tìm kiếm',
			dataIndex: 'number',
			width: 150,
			render: (number) => decisionSearchCounts[number] || 0,
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
				const book = diplomaBooks.find((b) => b.id === record.diplomaBookId);
				return book ? book.year : '-';
			},
		},
		{
			title: 'Thao tác',
			valueType: 'option',
			width: 120,
			render: (_, record) => [
				<Button key='view' type='link' onClick={() => history.push(`/diploma/info?decision=${record.number}`)}>
					Xem chi tiết
				</Button>,
			],
		},
	];

	return (
		<PageContainer
			header={{
				title: 'Danh sách quyết định tốt nghiệp',
				extra: [
					<Button key='back' icon={<ArrowLeftOutlined />} onClick={() => history.goBack()}>
						Quay lại
					</Button>,
				],
			}}
		>
			<ProTable<GraduationDecision>
				rowKey='id'
				search={{ labelWidth: 'auto' }}
				onSubmit={handleSearch}
				toolBarRender={() => [
					<Button key='create' type='primary' icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
						Thêm quyết định
					</Button>,
				]}
				columns={columns}
				dataSource={graduationDecisions}
				pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
			/>
			<GraduationDecisionForm visible={modalVisible} onClose={() => setModalVisible(false)} />
		</PageContainer>
	);
};

export default GraduationDecisionPage;
