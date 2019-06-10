import axios from "axios";

export default {
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
  }
};
