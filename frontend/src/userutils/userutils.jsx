const avatarColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1',
  '#14B8A6', '#F472B6', '#A855F7', '#22C55E', '#FB923C'
];

export const generateAvatarColor = () => {
  return avatarColors[Math.floor(Math.random() * avatarColors.length)];
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};