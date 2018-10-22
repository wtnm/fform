
import App from './components/App';

import path from 'path'
import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers';

const app = Express();
const port = 3000;

import { renderToString } from 'react-dom/server'

function handleRender(req, res) {
  // Create a new Redux store instance
  const store = createStore(rootReducer);

  // store.dispatch({type: 'INCREMENT'});
  // store.dispatch({type: 'INCREMENT'});
  // store.dispatch({type: 'INCREMENT'});

  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // Grab the initial state from our Redux store
  const preloadedState = store.getState();

  // Send the rendered page back to the client
  res.send(renderFullPage(html, preloadedState));
}

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/vendor.js"></script>
        <script src="/app.js"></script>
      </body>
    </html>
    `;
}

app.use(Express.static(path.resolve('dist/client'), {index: false}));
app.use(handleRender);
app.listen(port);

console.log(`Started an Express server at http://localhost:${port}/`);
