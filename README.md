# hydux-preact
preact renderer for hydux.

## Install
```sh
yarn add hydux hydux-preact # or npm i hydux hydux-preact
```

## Usage


```js
import _app from 'hydux'
import withPreact, { h } from 'hydux-preact'

let app = withPreact()(_app)

if (process.env.NODE_ENV === 'development') {
  require('preact/debug');
  // built-in dev tools, without pain.
  const devTools = require('hydux/lib/enhancers/devtools').default
  const logger = require('hydux/lib/enhancers/logger').default
  const hmr = require('hydux/lib/enhancers/hmr').default
  app = logger()(app)
  app = devTools()(app)
  app = hmr()(app)
}

export default app({
  init: () => { count: 1 },
  actions: {
    down: () => state => ({ count: state.count - 1 }),
    up: () => state => ({ count: state.count + 1 })
  },
  view: (state: State, actions: Actions) =>
    <div>
      <h1>{state.count}</h1>
      <button onClick={actions.down}>–</button>
      <button onClick={actions.up}>+</button>
    </div>
})
```

## Counter App

```sh
git clone https://github.com/hydux/hydux-preact.git
cd examples/counter
yarn # or npm i
npm start
```

Now open http://localhost:8080 and hack!

##` License

MIT
