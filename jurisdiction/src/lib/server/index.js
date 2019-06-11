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
  },

  // 获取角色列表

  // 获取所有未被删除的角色
  getRole() {
    return axios.get("/per/role?del=0");
  },
  // 改变被删除角色的 del 状态
  putRoleDel(data) {
    return axios.put("/per/role/" + data.id, data);
  },
  // 添加角色
  postRole(data) {
    return axios.post("/per/role", data);
  },
  // 修改角色信息
  putRoleData(data) {
    return axios.put("/per/role/" + data.id, data);
  },
  // 查询操作
  getsearchrole(data) {
    return axios.get("/per/role?name_like=" + encodeURIComponent(data.name));
  }
};
