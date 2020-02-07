import localDB from '../../lib/services/localDB';
import os from 'os';
import path from 'path';
import fs from 'fs';

describe('[Unit Testing] LocalDB', () => {
  const getCurrentTestingMinute = () => (new Date()).getMinutes();
  const testingMinute = getCurrentTestingMinute()

  const prismicConfigPath = path.join(os.homedir(), '.prismic');

  test('Saving',async () => {
    localDB.set({ 'testingValue': testingMinute });
    const json = fs.readFileSync(prismicConfigPath, 'utf8');
    const savedObj = JSON.parse(json);
    expect(savedObj.testingValue).toBe(testingMinute);
  })

  test('Getting', () => {
    expect(localDB.get('testingValue')).toBe(testingMinute);
  })

  test('Getting All', () => {
    const json = fs.readFileSync(prismicConfigPath, 'utf8');
    const savedObj = JSON.parse(json);
    expect(localDB.getAll()).toEqual(savedObj);
  })
})