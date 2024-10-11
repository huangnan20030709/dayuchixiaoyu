/**
 *  范围在 x - y 到 x + y 之间的随机数：
 */
export const rondom = (x: number, y: number) => {
  const min = x - y;
  const max = x + y;
  return Math.max(1, Math.floor(Math.random() * (max - min) + min));
};
