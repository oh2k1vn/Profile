export type SimulationType = 'particles' | 'network' | 'theme' | 'chat';

export interface Project {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  tech: string[];
  github: string;
  demoUrl?: string;
  simulationType: SimulationType;
}
