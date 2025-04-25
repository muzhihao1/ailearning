export default function SimpleLogin() {
  return (
    <div>
      <h1>简单登录页面</h1>
      <p>这是一个测试页面</p>
      <form>
        <div>
          <label htmlFor="email">电子邮箱</label>
          <input
            id="email"
            type="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">密码</label>
          <input
            id="password"
            type="password"
            required
          />
        </div>
        <button type="submit">
          登录
        </button>
      </form>
    </div>
  );
} 