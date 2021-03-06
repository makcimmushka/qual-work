import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CryptoHelperService {
  public async hash(stringToHash: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(stringToHash, salt);
  }

  public async compare(str: string, hash: string): Promise<boolean> {
    return bcrypt.compare(str, hash);
  }
}
