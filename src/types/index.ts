export interface Person {
  id: string;
  name: string;
}

export interface Meeting {
  id: string;
  name: string;
  participants: Person[];
  selectedModerators: Person[];
} 