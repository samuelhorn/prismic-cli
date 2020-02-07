import fs from 'fs';
import repository from '../../lib/commands/repository';
import Helpers from '../../lib/helpers';
import { isContext } from 'vm';

jest.mock('../../lib/context');
const context = require('../../lib/context');

describe('[Integration Testing] Repository', () => {
  const expectedUrl = new RegExp('^https://github\\.com/[\\w\\-\\.]+/([\\w\\-\\.]+)(/([\\w\\-\\.]+))+/([\\w\\-\\.]+).zip$');
  const configurationPath = './src/prismic-configuration.js';

  test('Should validate the theme without Conf', async () => {
    const opts = {
      ignoreConf: true,
      configPath: null
    };

    // Done this way because doMock wasn't working, prompt function was not replaced
    const inquirer = require('inquirer');
    inquirer.prompt = jest.fn(() => ({
      url: 'https://github.com/prismicio/reactjs-blog'
    }));

    const validationResponse = await repository.validateTheme(null, opts);

    expect(fs.existsSync(validationResponse.tmpFolder)).toBe(true);
    expect(validationResponse.template.name.length > 0).toBe(true);
    expect(validationResponse.template.url).toEqual(expect.stringMatching(expectedUrl));
  })

  test('Should validate the theme with Conf', async () => {
    const opts = {
      ignoreConf: true,
      configPath: configurationPath
    };

    // Done this way because doMock wasn't working, prompt function was not replaced
    const inquirer = require('inquirer');
    inquirer.prompt = jest.fn(() => ({
      url: 'https://github.com/prismicio/reactjs-blog'
    }));

    const validationResponse = await repository.validateTheme(null, opts);

    expect(fs.existsSync(validationResponse.tmpFolder)).toBe(true);
    expect(validationResponse.template.name.length > 0).toBe(true);
    expect(validationResponse.template.configuration).toEqual(configurationPath);
    expect(validationResponse.template.url).toEqual(expect.stringMatching(expectedUrl));
  })

  test('Should fall into retry loop for theme validation', async (done) => {
    const opts = {
      ignoreConf: true,
      configPath: configurationPath
    };

    // Done this way because doMock wasn't working, prompt function was not replaced
    const inquirer = require('inquirer');

    let i = 0
    inquirer.prompt = jest.fn(() => {
      if (!i++) {
        return { url: '' }
      }
      return done()
    })

    await repository.validateTheme(null, opts);
  })

  test('Should create a repository', async () => {
    var templates = [{
      name: 'React',
      url:
        'https://github.com/prismicio/reactjs-starter/archive/master.zip',
      configuration: 'src/prismic-configuration.js',
      innerFolder: 'reactjs-starter-master',
      instructions: 'Start your project: npm start',
      isQuickstart: false
    }]

    const context = require('../../lib/context');
    context.ctx = {
      base: 'https://prismic.io',
      isNew: true,
      Themes: {
        template: 'React'
      }
    }

    const inquirer = require('inquirer');
    inquirer.prompt = jest.fn((array) => {
      switch (array[0].name) {
        case 'template':
          return { template: 'React' };
        case 'folder':
          return { folder: '../dump/tobogan/' };
        case 'domain':
          return { domain: 'hugoleotobotbiedne' };
        case 'url':
          return { url: 'https://github.com/prismicio/reactjs-blog/archive/master.zip'};
      }
    });

    //! Stuck here
    const creationReturn = await repository.create(templates);

  })
})