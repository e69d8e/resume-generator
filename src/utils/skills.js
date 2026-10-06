// 技能标签在 state 中以英文逗号分隔字符串存储，预览中按 data-path 里的
// 标签索引回写单个标签；清空视为删除该标签
export function updateTagInTagsString(tagsString, tagIndex, value) {
  const tags = (tagsString || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
  const trimmed = value.trim();
  if (trimmed === '') {
    tags.splice(tagIndex, 1);
  } else if (tagIndex >= 0 && tagIndex < tags.length) {
    tags[tagIndex] = trimmed;
  } else {
    tags.push(trimmed);
  }
  return tags.join(', ');
}
