import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  publicPath: 'https://cdn.jsdelivr.net/gh/FourF-src/f-tools@master/dist/',
  runtimePublicPath: true,
  proxy: {
    "/api": {
      target: "http://localhost:9000/",
      changeOrigin: true,
    }  
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: true,
      dynamicImport: false,
      title: 'four-f',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
}

export default config;
