import React, { useEffect, useState } from 'react';
import { Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { Permissions } from 'models/permissions';
import { Role } from 'models/roles';

interface PermissionCheckboxProps {
  permission: Permissions[];
  onChange: (updatedSelection: string[]) => void;
  style?: React.CSSProperties;
  role?: Role;
}

const PermissionCheckbox: React.FC<PermissionCheckboxProps> = ({
  permission,
  onChange,
  style,
  role,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>();
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

  useEffect(() => {
    const newCheckedKeys: React.Key[] = [];
    role?.permissions?.forEach((perm) => {
      perm.children?.forEach((child) => {
        newCheckedKeys.push(child.id);
      });
    });
    setCheckedKeys(newCheckedKeys);
  }, [role, permission]);

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    const newCheckedKeys = checkedKeysValue as React.Key[];
    setCheckedKeys(newCheckedKeys);

    const selectedPermissionNames: Set<string> = new Set();

    newCheckedKeys.forEach((key) => {
      const parentPermission = permission.find((perm) => perm.id === key);
      parentPermission
        ? selectedPermissionNames.add(parentPermission.code)
        : permission.forEach((perm) => {
            const child = perm.children?.find((child) => child.id === key);
            child &&
              (selectedPermissionNames.add(child.code),
              selectedPermissionNames.add(perm.code));
          });
    });
    onChange(Array.from(selectedPermissionNames));
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
