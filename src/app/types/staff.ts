export interface Staff {
  id: string;
  created_at: string;
  name: string;
  display_name: string;
  profile_image_url?: string;
  rank?: number;
  category?: string;
  main_title?: string;
  tags?: string[];
  bio?: string;
  is_available: boolean;
}
