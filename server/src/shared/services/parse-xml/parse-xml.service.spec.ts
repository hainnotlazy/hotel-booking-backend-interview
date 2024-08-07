import { Test, TestingModule } from '@nestjs/testing';
import { ParseXmlService } from './parse-xml.service';

describe('ParseXmlService', () => {
  let service: ParseXmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseXmlService],
    }).compile();

    service = module.get<ParseXmlService>(ParseXmlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
