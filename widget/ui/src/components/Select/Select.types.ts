type Item = {
  value: string;
  label: string;
};
export interface PropTypes {
  options: Item[];
  handleItemClick?: (item: Item) => void;
  value: Item;
  container?: HTMLElement;
}
