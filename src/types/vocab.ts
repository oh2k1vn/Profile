export interface VocabItem {
  id: number;
  topic:
    | "play_games"
    | "travelling"
    | "social_media"
    | "sport"
    | "learning_online"
    | "shopping_online"
    | "other";
  word: string;
  type: string;
  meaning_vi: string;
  example_simple: string;
  example_expand: string;
  tags: string[];
}

export interface VocabData {
  meta: {
    language: string;
    purpose: string;
  };
  data: VocabItem[];
}
