import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	HomeOutlined,
	UserOutlined,
	BookOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './AntNavigation.scss';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}

const items: MenuItem[] = [
	getItem('Home', 'home', <HomeOutlined />),
	getItem('Results', 'results', <PieChartOutlined />),
	getItem('Profile', 'profile', <UserOutlined />),
	getItem('About', 'about', <BookOutlined />),
];

const AntNavigation: React.FC = (props: any) => {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);

	const onClick: MenuProps['onClick'] = (e) => {
		navigate(e.key);
	};

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}>
				<div className="logo" />
				<Menu
					theme="dark"
					defaultSelectedKeys={['1']}
					mode="inline"
					items={items}
					onClick={onClick}
				/>
			</Sider>
			<Layout className="site-layout">
				<Header
					className="site-layout-background"
					style={{ padding: 0 }}
				/>
				<Content style={{ margin: '0 16px' }}>
					<Outlet />
				</Content>
				<Footer style={{ textAlign: 'center' }}>
					Fabin Inc ©2022 Created by Sharon Fabin
				</Footer>
			</Layout>
		</Layout>
	);
};

export default AntNavigation;
