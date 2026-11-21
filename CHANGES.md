# Changes

## 0.2.0 2026-11-21

First entry of this change log. Earlier versions are on npm and in the git
history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0` (there was no peer, and
  the tests ran on Seneca 3.29). Seneca 3 users stay on
  `@seneca/search-mini@0.1`.
* Node.js 24 or later (`engines.node` `>=24`; there was no `engines`).
* Breaking: the plugin fails to load with the error code `invalid_search`
  when the `search` option is missing. Before, it loaded without defining
  any action.
* Fix: invalid messages get a reply. `sys:search,cmd:add` without `doc` or
  `doc.id`, `cmd:search` without `query`, `cmd:remove` without `id` and
  `cmd:add_all` without `docs` reply with `ok: false` and the details. Before,
  they never replied, and the caller failed with a timeout. The check for a
  missing `doc.id` never fired; it now does.
* Tests run on Seneca 4 and no longer load the doc plugin. The shared
  compliance suites of `seneca-search-test` are copied into
  `test/search-test.js`, because that package is not on npm and the
  development dependency on it was an unpinned `git+ssh` URL. New tests cover
  the invalid messages and the missing `search` option. The `maintain` test
  skips the check `check_default` in a pull request or tag build, and
  `url_pkgjson` on Windows (DEC-27). devDependencies: `seneca` `^4.0.0`,
  `seneca-plugin-validator` `^0.7.0`, `@seneca/maintain` `^0.1.0` and
  `@seneca/doc` `^9.0.0`; `seneca-promisify` and `seneca-search-test` are
  removed.
* `local/dev.js` loads the plugin from `search-mini.js` and no longer uses
  `promisify`.
* `package.json`: `license` is `MIT`, as in `LICENSE` (was `ISC`); `files`
  limits the package to the plugin, its doc file, `LICENSE`, `README.md` and
  `CHANGES.md` (0.1.6 also shipped `examples/`, `local/`, `test/` and
  `.github/`); `publishConfig.access` is `public`; a description.
