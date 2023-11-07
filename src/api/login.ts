import request from '../utils/request'
import { login_type, register_type } from '../type/login'
// 登录
export const login = (data: login_type) => {
  return request.post('/gonghui/login/login', data)
}
// 注册
export const register = (data: register_type) => {
  return request.post('/gonghui/register/register', data)
}
