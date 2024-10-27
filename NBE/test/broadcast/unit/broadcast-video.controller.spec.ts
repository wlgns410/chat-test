// test/broadcast-video/broadcast-video.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BroadcastVideoController } from '../../../src/interface/presentation/broadcast/controller/broadcast-video.controller';
import { BroadcastVideoService } from '../../../src/domain/broadcast/service/broadcast-video.service';
import { BroadcastVideoDomain } from '../../../src/domain/broadcast/model/broadcast-video.domain';

describe('BroadcastVideoController', () => {
  let controller: BroadcastVideoController;
  let service: BroadcastVideoService;

  // Mock data
  const mockBroadcastVideo: BroadcastVideoDomain = {
    id: 1,
    broadcastId: 1,
    vodUrl: 'http://example.com/vod.mp4',
    subtitleUrl: 'http://example.com/subtitles.srt',
  };

  const mockBroadcastVideoList: BroadcastVideoDomain[] = [mockBroadcastVideo];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BroadcastVideoController],
      providers: [
        {
          provide: BroadcastVideoService,
          useValue: {
            createBroadcastVideo: jest.fn().mockResolvedValue(mockBroadcastVideo),
            getBroadcastVideos: jest.fn().mockResolvedValue(mockBroadcastVideoList),
          },
        },
      ],
    }).compile();

    controller = module.get<BroadcastVideoController>(BroadcastVideoController);
    service = module.get<BroadcastVideoService>(BroadcastVideoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // VOD 생성 테스트
  describe('createBroadcastVideo', () => {
    it('should create a new VOD', async () => {
      const result = await controller.createBroadcastVideo(mockBroadcastVideo);

      expect(result).toEqual(mockBroadcastVideo);
      expect(service.createBroadcastVideo).toHaveBeenCalledWith(mockBroadcastVideo);
    });
  });

  // 특정 방송의 VOD 목록 조회 테스트
  describe('getBroadcastVideos', () => {
    it('should return a list of VODs for a specific broadcast', async () => {
      const result = await controller.getBroadcastVideos(1);

      expect(result).toEqual(mockBroadcastVideoList);
      expect(service.getBroadcastVideos).toHaveBeenCalledWith(1);
    });
  });
});
