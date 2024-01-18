// Define Type for episode data
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url?: string;
  created?: string;
}

export interface CharacterInfos {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url?: string;
  created?: string;
}

export interface Location {
  name: string;
  url: string;
}
export interface Seasons {
  season1: Episode[];
  season2: Episode[];
  season3: Episode[];
  season4: Episode[];
  season5: Episode[];
}
