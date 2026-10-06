let counter = 0;

// Date.now() 在同一毫秒内会碰撞（快速连点添加按钮），拼接自增计数器保证唯一
export function generateId(prefix) {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}
