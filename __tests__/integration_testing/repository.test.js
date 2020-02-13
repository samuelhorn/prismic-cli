import fs from 'fs';
import path from 'path';
import { mergeRight } from 'ramda';
import LocalDB from '../../lib/services/localDB';
import repository from '../../lib/commands/repository';

jest.mock('../../lib/context');

const credentials = {
  email: 'amaury@prismic.io',
  password: 'wio8859!'
};

function promptOutputs(elem, resultObj) {
  switch (elem.name) {
    case 'template':
      return { template: resultObj.template };
    case 'folder':
      return { folder: resultObj.folder };
    case 'domain':
      return { domain: resultObj.domain };
    case 'login':
      return { login: 'login' };
    case 'url':
      return { url: resultObj.url };
    case 'email':
      return credentials;
  }
}

describe('[Integration Testing] Repository', () => {
  const expectedUrl = new RegExp('^https://github\\.com/[\\w\\-\\.]+/([\\w\\-\\.]+)(/([\\w\\-\\.]+))+/([\\w\\-\\.]+).zip$');
  const configurationPath = './src/prismic-configuration.js';
  const projectDirPath = __dirname.split("/").slice(0, -2).join("/")
  const templates = [{
    name: 'React',
    url:
      'https://github.com/prismicio/reactjs-starter/archive/master.zip',
    configuration: 'src/prismic-configuration.js',
    innerFolder: 'reactjs-starter-master',
    instructions: 'Start your project: npm start',
    isQuickstart: false
  }]

  test('Should validate the theme without Conf', async () => {
    const opts = {
      ignoreConf: true,
      configPath: null
    };

    // Done this way because doMock wasn't working, prompt function was not replaced
    const inquirer = require('inquirer');
    inquirer.prompt = jest.fn(() => Promise.resolve({
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
    inquirer.prompt = jest.fn(async () => Promise.resolve({
      url: 'https://github.com/prismicio/reactjs-blog'
    }));

    const validationResponse = await repository.validateTheme(null, opts);

    expect(fs.existsSync(validationResponse.tmpFolder)).toBe(true);
    expect(validationResponse.template.name.length > 0).toBe(true);
    expect(validationResponse.template.configuration).toEqual(configurationPath);
    expect(validationResponse.template.url).toEqual(expect.stringMatching(expectedUrl));
  })

  // test('Should fall into retry loop for theme validation', async (done) => {
  //   const opts = {
  //     ignoreConf: true,
  //     configPath: configurationPath
  //   };

  //   // Done this way because doMock wasn't working, prompt function was not replaced
  //   const inquirer = require('inquirer');qt
  //   let i = 0
  //   inquirer.prompt = jest.fn(async () => Promise.resolve(() => {
  //     if (!i++) {
  //       return { url: '' };
  //     }
  //     return done();
  //   })
  //   )
  //   await repository.validateTheme(null, opts);
  // })

  test('Should create a new repository', async () => {
    const promptOutputObject = {
      template: 'React',
      folder: './test_integration',
      domain: 'customTypesTest',
      url: 'https://github.com/prismicio/reactjs-blog',
    }

    const context = require('../../lib/context');

    context.ctx = {
      base: 'http://wroom.test',
      isNew: true,
      Themes: {
        template: 'React'
      },
      appCtx: [],
      Auth: {
        email: credentials.email,
        password: credentials.password,
        oauthAccessToken: ''
      },
      cookies: LocalDB.get('cookies')
    };
    // Couldn't find any other solution in order for the function to be called I had to
    // mock it. Open to any other solution but not setting the cookie will result
    // in an infinite loop.
    context.setCookies = (cookies) => {
      context.ctx = mergeRight(context.ctx, { cookies });
      LocalDB.set({ cookies });
    }

    const inquirer = require('inquirer');
    inquirer.prompt = jest.fn(async (array) => Promise.resolve(
      promptOutputs(array[0],
        promptOutputObject
      ))
    );

    await repository.create(templates);

    const createdFolderPath = path.join(projectDirPath, promptOutputObject.folder)
    const createdProjectConfPath = path.join(createdFolderPath, configurationPath);

    expect(fs.existsSync(createdProjectConfPath)).toBe(true)

    fs.readFileSync(createdProjectConfPath, 'utf8', (err, data) => {
      if (err) throw err;
      expect(data).toEqual(expect.stringMatching(promptOutputObject.domain))
    })
  }, 60000)

  test('Should create a project based on an existing repository', async () => {
    const promptOutputObject = {
      template: 'React',
      folder: './test_integration',
      domain: 'customTypes',
      url: 'https://github.com/prismicio/reactjs-blog',
    };

    const context = require('../../lib/context');
    context.ctx = {
      base: 'http://wroom.test',
      isNew: false,
      Themes: {
        template: 'React'
      },
      appCtx: [],
      Auth: {
        email: credentials.email,
        password: credentials.password,
        oauthAccessToken: ''
      },
      cookies: LocalDB.get('cookies')
    };
    // Couldn't find any other solution in order for the function to be called I had to
    // mock it. Open to any other solution but not setting the cookie will result
    // in an infinite loop./
    context.setCookies = (cookies) => {
      context.ctx = mergeRight(context.ctx, { cookies });
      LocalDB.set({ cookies });
    }


    const inquirer = require('inquirer');
    inquirer.prompt = jest.fn(async (array) => Promise.resolve(
      promptOutputs(array[0],
        promptOutputObject
      ))
    );

    await repository.create(templates);

    const createdFolderPath = path.join(projectDirPath, promptOutputObject.folder)
    const createdProjectConfPath = path.join(createdFolderPath, configurationPath);

    expect(fs.existsSync(createdProjectConfPath)).toBe(true)

    fs.readFileSync(createdProjectConfPath, 'utf8', (err, data) => {
      if (err) throw err;
      expect(data).toEqual(expect.stringMatching(promptOutputObject.domain))
    })
  }, 60000)
})