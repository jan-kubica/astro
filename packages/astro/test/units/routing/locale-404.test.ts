import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getLocaleFromPathname } from '../../../dist/core/routing/helpers.js';
import type { SSRManifestI18n } from '../../../dist/core/app/types.js';

describe('getLocaleFromPathname', () => {
	const i18n: SSRManifestI18n = {
		defaultLocale: 'en',
		locales: ['en', 'ja', 'ko', 'zh'],
		strategy: 'pathname-prefix-always',
		fallback: { ja: 'en', ko: 'en', zh: 'en' },
		fallbackType: 'rewrite',
		domainLookupTable: {},
		domains: undefined,
	};

	it('extracts locale from pathname with locale prefix', () => {
		assert.equal(getLocaleFromPathname('/en/nonexistent', i18n), 'en');
		assert.equal(getLocaleFromPathname('/ja/nonexistent', i18n), 'ja');
		assert.equal(getLocaleFromPathname('/ko/some/path', i18n), 'ko');
		assert.equal(getLocaleFromPathname('/zh/', i18n), 'zh');
	});

	it('returns undefined for paths without a locale prefix', () => {
		assert.equal(getLocaleFromPathname('/nonexistent', i18n), undefined);
		assert.equal(getLocaleFromPathname('/', i18n), undefined);
	});

	it('returns undefined for unknown locale prefixes', () => {
		assert.equal(getLocaleFromPathname('/fr/page', i18n), undefined);
		assert.equal(getLocaleFromPathname('/de/page', i18n), undefined);
	});

	it('handles case-insensitive locale matching', () => {
		assert.equal(getLocaleFromPathname('/EN/page', i18n), 'en');
		assert.equal(getLocaleFromPathname('/JA/page', i18n), 'ja');
	});

	it('handles object locales with path and codes', () => {
		const i18nWithObjects: SSRManifestI18n = {
			...i18n,
			locales: ['en', { path: 'japanese', codes: ['ja', 'ja-JP'] }],
		};
		assert.equal(getLocaleFromPathname('/japanese/page', i18nWithObjects), 'japanese');
		assert.equal(getLocaleFromPathname('/ja/page', i18nWithObjects), 'japanese');
	});
});
