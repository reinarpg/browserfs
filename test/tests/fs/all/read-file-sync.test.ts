import { backends, fs, configure, tmpDir, fixturesDir } from '../../../common';
import path from 'path';

describe.each(backends)('%s fs file reading', (name, options) => {
	const configured = configure({ fs: name, options });

	const filepath = path.join(fixturesDir, 'elipses.txt');

	if (fs.getRootFS().supportsSynch()) {
		it('should read file synchronously and verify the content', async () => {
			await configured;
			const content = fs.readFileSync(filepath, 'utf8');

			for (let i = 0; i < content.length; i++) {
				expect(content[i]).toBe('\u2026');
			}

			expect(content.length).toBe(10000);
		});
	}
});
