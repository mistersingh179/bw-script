# BW Script

Web content interaction script for BrandWeaver.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. SSL for development:
   - For secure local development, generate SSL certificates:
     ```
     openssl req -newkey rsa:2048 -nodes -keyout server.key -x509 -days 365 -out server.crt
     ```
   - Add the certificate to your trusted certificates in your OS

## Development

- Build for development: `npm run dev`
- Build for production: `npm run build`

## Usage

The script provides various content interaction features:
- Interactive content tooltips
- Meta content extraction
- Analytics and event tracking

## esbuild Commands

- `npx esbuild foo.js --bundle --outfile=out.js`

###  options

- The entrypoint is not limited to one file name, they can be many.
- `--bundle` gets all imported files/packages etc. in to 1 file. If we don't do this then it will have imports which will break
- `--outdir` where you want content, useful when you have many entry points. Can be used instead of `--outfile`
- `--platform` defaults to browser
- `--minify` for prod & `--sourcemap` for dev
- `--target` to target an older version of the platform
- `--watch` to rebuild on change
- `--serve` starts a server & builds & delivers file on every request. It also blocks till the build is complete, so we can know for sure that we are getting the latest file on every reload
- `--servedir` to specify what to serve

### Live reload in dev
- Use `--watch` so it compiles when code changes
- Then `--serve` so it delivers the file over a server
- And in client subscribe to the `change` event on `/esbuild` and reload page.
```
new EventSource('/esbuild').addEventListener('change', () => location.reload())
```
- Now when new build is available, it will fire this event and then page will reload itself

### Front-end flow
- Abort if we have `meta[bw-opt-out="true"]`
- Make call to auctions
- Process response & update DOM with content
- Add click handler to links

## Making Prisma Typescript work
- Manually copy `.prisma/client/index.d.ts` from `bw-dashboard` project to root of `bw-script`
- The file is changing as the schema evolves in the dashboard
- We should copy it to get access to the latest types.

## License

MIT © 2025 MASALSA Inc.