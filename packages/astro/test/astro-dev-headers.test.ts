import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { load as cheerioLoad } from 'cheerio';
import { type DevServer, type Fixture, loadFixture } from './test-utils.ts';

describe('Astro dev headers', () => {
	let fixture: Fixture;
	let devServer: DevServer;
	const headers = {
		'x-astro': 'test',
	};

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/astro-dev-headers/',
			server: {
				headers,
			},
			outDir: './dist/astro-dev-headers-astro-dev-headers/',
			cacheDir: './node_modules/.astro-test/astro-dev-headers-astro-dev-headers/',
		});
		await fixture.build();
		devServer = await fixture.startDevServer();
	});

	after(async () => {
		await devServer.stop();
	});

	describe('dev', () => {
		it('returns custom headers for valid URLs', async () => {
			const result = await fixture.fetch('/');
			assert.equal(result.status, 200);
			assert.equal(Object.fromEntries(result.headers)['x-astro'], headers['x-astro']);
		});

		it('returns custom headers in the default 404 response', async () => {
			const result = await fixture.fetch('/bad-url');
			assert.equal(result.status, 404);
			assert.equal(Object.fromEntries(result.headers).hasOwnProperty('x-astro'), true);
		});
	});
});

describe('Astro dev with vite.base path', () => {
	let fixture: Fixture;
	let devServer: DevServer;
	const headers = {
		'x-astro': 'test',
	};

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/astro-dev-headers/',
			server: {
				headers,
			},
			vite: {
				base: '/hello',
			},
			outDir: './dist/astro-dev-headers-astro-dev-with-vite-base-path/',
			cacheDir: './node_modules/.astro-test/astro-dev-headers-astro-dev-with-vite-base-path/',
		});
		await fixture.build();
		devServer = await fixture.startDevServer();
	});

	after(async () => {
		await devServer.stop();
	});

	it('Generated script src get included with vite.base path', async () => {
		const result = await fixture.fetch('/hello');
		const html = await result.text();
		const $ = cheerioLoad(html);
		assert.match($('script').attr('src')!, /^\/hello\/@vite\/client$/);
	});
});

describe('Astro dev with config.base path', () => {
	let fixture: Fixture;
	let devServer: DevServer;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/astro-dev-headers/',
			base: '/docs',
			outDir: './dist/astro-dev-headers-astro-dev-with-config-base/',
			cacheDir: './node_modules/.astro-test/astro-dev-headers-astro-dev-with-config-base/',
		});
		devServer = await fixture.startDevServer();
	});

	after(async () => {
		await devServer.stop();
	});

	it('prefixes dev script src with config.base for reverse proxy support', async () => {
		const result = await fixture.fetch('/docs/');
		const html = await result.text();
		const $ = cheerioLoad(html);
		assert.match($('script').attr('src')!, /^\/docs\/@vite\/client$/);
	});
});
