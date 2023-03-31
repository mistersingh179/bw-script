## esbuild Commands

- `npx esbuild foo.js --bundle --outfile=out.js`

###  options

- the entrypoint is not limited to one file name, they can be many.
- `--bundle` gets all imported files/packages etc. in to 1 file. if we don't do this then it will have improts which will break
- `--outdir` where you want content, useful when you have many entry points. can be used instead of `--outfile`
- `--platform` defaults to browser
- `--minify` for prod & `--sourcemap` for dev
- `--target` to target an older version of the platform
- `--watch` to rebuild on change
- `--serve` starts a server & builds & delivers file on every request. it also blocks till the build is complete, so we can know for sure that we are getting the latest file on every reload
- `--servedir` to specify what to serve

### to live reload in dev
- use `--watch` so it compiles when code changes
- then `--serve` so it delivers the file over a server
- and in client subscribe to the `change` event on `/esbuild` and reload page.
```
new EventSource('/esbuild').addEventListener('change', () => location.reload())
```
- now when new build is available, it will fire this event and then page will reload itself
