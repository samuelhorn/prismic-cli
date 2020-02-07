import inquirer from 'inquirer';
import Base from '../../lib/commands/base';
import os from 'os';
import path from 'path';
import fs from 'fs';

jest.mock('inquirer', () => ({
  _esModule: true,
  prompt: () => Promise.resolve({base :'https://www.wroom.test'})
}))

describe('[Unit Testing] Base', () => {
  const prismicConfigPath = path.join(os.homedir(), '.prismic');

  test('Exec Prompt', async () => {
    await Base();
    const json = fs.readFileSync(prismicConfigPath, 'utf8');
    const savedObj = JSON.parse(json);
    expect(savedObj.base).toBe('https://www.wroom.test');
  })

})