import React from 'react';
import {DownOutlined, EllipsisOutlined} from '@ant-design/icons';
import {Button, ConfigProvider, Dropdown, Space} from 'antd';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {theme} from "./theme.ts";
import "./ant-dropdown.css";

interface DropdownMenuProps {
    menuName: string;
    options: {
        label: string;
        key: string;
        icon?: React.ReactNode;
        to?: string;
    }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ menuName, options }) => {
    const items: MenuProps['items'] = options.map(option => ({
        label: option.to ? (
            <Link to={option.to} className="dropdown-item-link">
                {option.label}
            </Link>
        ) : option.label,
        key: option.key,
        icon: option.icon || <EllipsisOutlined />,
        className: 'dropdown-item',
    }));

    const menuProps = {
        items,
    };

    return (
        <ConfigProvider theme={theme}>
            <Space wrap>
                <Dropdown
                    menu={menuProps}
                    trigger={['click']}
                    placement="bottomRight"
                    arrow
                >
                    <Button>
                        <Space>
                            {menuName}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </Space>
        </ConfigProvider>
    );
};

export default DropdownMenu;
