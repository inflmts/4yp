import { dataToEsm } from '@rollup/pluginutils';
import { parse as parseTOML } from 'smol-toml';
import tailwindcss from 'tailwindcss';

function toml() {
  return {
    name: 'toml',
    transform(code, id) {
      if (id.endsWith('.toml')) {
        return dataToEsm(parseTOML(code), {
          namedExports: false
        });
      }
    }
  };
}

/** @type {import('vite').UserConfig} */
export default {
  base: '',
  appType: 'mpa',
  plugins: [
    toml()
  ],
  build: {
    modulePreload: {
      polyfill: false
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss()
      ]
    }
  }
};
