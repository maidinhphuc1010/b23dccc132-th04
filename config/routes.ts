export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},

	// QUẢN LÝ VĂN BẰNG
	{
		path: '/diploma',
		name: 'Quản lý văn bằng',
		icon: 'FileTextOutlined',
		access: 'canAdmin',
		routes: [
			{
				path: '/diploma/book',
				name: 'Sổ văn bằng',
				component: './diploma/book',
				icon: 'BookOutlined',
			},
			{
				path: '/diploma/decision',
				component: './diploma/decision/GraduationDecisionPage',
			},
			{
				path: '/diploma/form',
				name: 'Cấu hình biểu mẫu',
				component: './diploma/form/DiplomaFormPage',
				icon: 'FormOutlined',
			},
			{
				path: '/diploma/info',
				name: 'Thông tin văn bằng',
				component: './diploma/info/DiplomaInfoPage',
				icon: 'ProfileOutlined',
			},
		],
	},

	// TRA CỨU VĂN BẰNG
	{
		path: '/diploma/search',
		name: 'Tra cứu văn bằng',
		component: './diploma/search',
		icon: 'SearchOutlined',
	},

	// CÁC TRANG KHÁC
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
