export class BroadcastVideoDomain {
  id: number;
  broadcastId: number;
  vodUrl: string;
  subtitleUrl: string;

  constructor(id: number, broadcastId: number, vodUrl: string, subtitleUrl: string) {
    this.id = id;
    this.broadcastId = broadcastId;
    this.vodUrl = vodUrl;
    this.subtitleUrl = subtitleUrl;
  }
}
