module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "x-invalid-end-tag": false,
    "x-invalid-namespace": false
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
