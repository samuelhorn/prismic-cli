import template from '../../lib/commands/template';
import fs from 'fs';

describe('[Unit Test] Template', () => {
  test('[Success Case] Unzip', async () => {
    const validZipTemplate = 'https://github.com/prismicio/reactjs-blog/archive/master.zip'
    const tempZipPath = await template.unzip(validZipTemplate);
    expect(fs.existsSync(tempZipPath)).toBe(true)
  })

  test('[Fail Case] Unzip',async () => {
    const invalidZipPath = 'https://github.com/prismicio/reactjs-blog/';
    return expect(template.unzip(invalidZipPath)).rejects.toEqual(expect.stringContaining("Invalid or unsupported zip format. No END header found"));
  })
})