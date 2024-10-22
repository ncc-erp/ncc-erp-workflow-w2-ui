import React, { useState } from 'react';
import { Tree } from 'antd';

interface Permission {
  id: number;
  name: string;
  children?: Permission[];
}

interface PermissionCheckboxProps {
  permission: Permission;
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
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(selectedPermissions);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const treeData = [
    {
      title: permission.name,
      key: permission.id.toString(),
      children: permission.children?.map((child) => ({
        title: child.name,
        key: child.id.toString(),
        isLeaf: true,
      })),
    },
  ];

  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys as string[]);
    setAutoExpandParent(false);
  };

  const onCheck = (
    checkedKeysValue:
      | React.Key[]
      | { checked: React.Key[]; halfChecked: React.Key[] }
  ) => {
    let updatedSelection: string[] = [];

    if (Array.isArray(checkedKeysValue)) {
      updatedSelection = checkedKeysValue as string[];
    } else {
      updatedSelection = checkedKeysValue.checked as string[];
    }

    setCheckedKeys(updatedSelection);

    onChange(updatedSelection);
  };

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      treeData={treeData}
      style={style}
    />
  );
};

export default PermissionCheckbox;
