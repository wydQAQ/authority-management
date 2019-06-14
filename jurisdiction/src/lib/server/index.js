import axios from "axios";

export default {
  // #region 用户列表请求
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
  // #endregion

  // #region 用户列表添加身份
  postListUserShen(data) {
    return axios.post("/per/user_role", data);
  },
  deleteListUserShen(data) {
    return axios.put("/per/user_role/" + data.id, data);
  },
  getListUserShen(params) {
    return axios.get(`/per/user_role?del=0&userId=${params.userId}`);
  },
  // #endregion

  // #region 角色列表

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
  },

  // #endregion

  // #region 角色分配权限
  // 为角色添加权限
  postRolePer(data) {
    return axios.post("/per/role_permission", data);
  },
  // 为角色删除权限
  delRolePer(data) {
    return axios.put(`/per/role_permission/${data.id}`, data);
  },
  // 获取 role_permission 数据
  getRolePer(params) {
    return axios.get(`/per/role_permission?del=0&roleId=${params.roleId}`);
  },
  // #endregion

  // 无过滤获取角色列表
  getUserJiao() {
    return axios.get("/per/role");
  },

  // #region 用户权限请求
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
// #endregion
