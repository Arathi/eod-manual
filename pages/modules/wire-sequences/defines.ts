export enum WireColor {
  none,
  red,
  blue,
  black,
}

export type ConnectPoint = "A" | "B" | "C" | null;

export enum WireStatus {
  // 待定
  pending = -1,
  // 勿动
  nop,
  // 剪断
  cut,
}
