import axios from "axios";

export default {
  //用户列表请求
  login(data) {
    return axios.post("/api/userlogin", data);
  },
  getUsers() {
    return axios.get("/per/users");
  },
  postUser(data) {
    return axios.post("/per/users", data);
  },
  deluserData(data) {
    return axios.delete("/per/users/" + data.id);
  },
  getsearchuser(data) {
    return axios.get("/per/users?name_like=" + encodeURIComponent(data.name));
  },
  putUserData(data) {
    return axios.put("/per/users/" + data.id, data);
  },

  getUserJiao() {
    return axios.get("/per/role");
  },
  //用户权限请求
  getQuanData() {
    return axios.get("/per/permission?del=" + 0);
  },
  searchQuanData(data) {
    return axios.get(
      "/per/permission?des_like=" + encodeURIComponent(data.des)
    );
  },
  delQuanData(data) {
    return axios.put("/per/permission/" + data.id, data);
  },
  postQuanData(data) {
    return axios.post("/per/permission", data);
  }
};
