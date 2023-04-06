export interface FeedItem {
  id: number;
  feedName: string;
  title: string;
  description: string;
  url: string;
  pubDate: string;
  isRead: boolean | null;
  currentTime: number | null;
  mediaType: string | null;
  mediaUrl: string | null;
}

export type Feed = FeedItem[];

export interface GetFeedResponse {
  status: number;
  feed: Feed;
}
