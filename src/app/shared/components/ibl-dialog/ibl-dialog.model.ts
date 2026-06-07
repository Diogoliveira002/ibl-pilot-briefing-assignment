export interface IblDialogAction {
  label: string;
  result: unknown;
  type?: '' | 'elevated' | 'outlined' | 'filled' | 'tonal';
}

export interface IblDialogData {
  title: string;
  message?: string;
  actions: IblDialogAction[];
}
