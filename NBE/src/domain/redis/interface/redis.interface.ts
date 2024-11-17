export interface ViewerRepository {
  incrementViewerCount(broadcastId: string): Promise<void>;
  decrementViewerCount(broadcastId: string): Promise<void>;
  getViewerCount(broadcastId: string): Promise<number>;
}
