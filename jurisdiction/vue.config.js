module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.1.130:8888/",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "/api"
        }
      },
      "/per": {
        target: "http://192.168.1.130:8888/",
        changeOrigin: true,
        ws: true
      }
    }
  }
};
