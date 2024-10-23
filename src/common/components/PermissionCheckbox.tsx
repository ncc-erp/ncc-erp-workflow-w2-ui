import React, { useState } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { Permissions } from 'models/permissions';
interface PermissionCheckboxProps {
  permission: Permissions[];
  selectedPermissions: string[];
  onChange: (updatedSelection: string[]) => void;
  style?: React.CSSProperties;
}

const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
  permission,
  selectedPermissions,
  onChange,
  style,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] =
    useState<React.Key[]>(selectedPermissions);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const treeData: TreeDataNode[] = permission.map((permission) => ({
    title: permission.name,
    key: permission.id,
    children:
      permission.children?.map((child) => ({
        title: child.name,
        key: child.id,
        isLeaf: true,
      })) || [],
  }));

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const newCheckedKeys = checkedKeysValue as React.Key[];
    setCheckedKeys(newCheckedKeys);

    const selectedPermissionNames = newCheckedKeys
      .flatMap((key) => {
        const parentPermission = permission.find(
          (permission) => permission.id === key
        );
        if (parentPermission) {
          return parentPermission.name;
        }
        return permission.flatMap(
          (permission) =>
            permission.children
              ?.map((child) => (child.id === key ? child.name : null))
              .filter(Boolean) || []
        );
      })
      .filter(Boolean) as string[];

    onChange(selectedPermissionNames);
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeysValue) => {
    setSelectedKeys(selectedKeysValue);
  };
  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
      style={style}
    />
  );
};

export default PermissionCheckbox;
