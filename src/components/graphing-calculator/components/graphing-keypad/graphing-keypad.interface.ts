export interface GraphingKeypadProps {
  onInsert: (symbol: string) => void;
  onReset: () => void;
  onBackspace: () => void;
}
