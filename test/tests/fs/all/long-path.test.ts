import { backends, fs, configure, tmpDir, fixturesDir } from '../../../common';
import * as path from 'path';

import { promisify } from 'node:util';

describe.each(backends)('%s fs.writeFile', (name, options) => {
	const configured = configure({ fs: name, options });
	if (!fs.getRootFS().isReadOnly()) {
		const fileNameLen = Math.max(260 - tmpDir.length - 1, 1);
		const fileName = path.join(tmpDir, new Array(fileNameLen + 1).join('x'));
		const fullPath = path.resolve(fileName);

		it('should write file and verify its size', async () => {
			await configured;
			await promisify<string, string, void>(fs.writeFile)(fullPath, 'ok');
			const stats = await promisify(fs.stat)(fullPath);
			expect(stats.size).toBe(2);
		});

		afterAll(async () => {
			await promisify(fs.unlink)(fullPath);
		});
	}
});
