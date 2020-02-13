import fs from 'fs';
import path from 'path';
import LocalDB from '../../lib/services/localDB';

describe('[Unit Testing] Slice Machine', () => {
  test('Setting up a new endpoint', async () => {
    const inquirer = require('inquirer');
    inquirer.prompt = jest.fn(() => Promise.resolve(
      { endpoint: 'http://'}
    ))


  })
})