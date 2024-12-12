import React from 'react';
import {DownOutlined, EllipsisOutlined} from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';

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
        <Space wrap>
            <Dropdown menu={menuProps} className={"ant-dropdown-menu"}>
                <Button className="dropdown-button">
                    <Space>
                        {menuName}
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </Space>
    );
};

export default DropdownMenu;
