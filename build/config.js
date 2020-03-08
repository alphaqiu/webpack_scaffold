/* 环境相关的配置 */
module.exports = {
  devProps: {
    title: "我是测试环境",
	hash: false,
	configs: {
		message: '我是测试环境的消息'
	}
  },
  prdProps: {
    title: "我是生产环境",
    minifiy: true,
	hash: false,
	configs: {
		message: '我是生产环境的消息'
	}
  }
};
