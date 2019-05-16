import ProgressBar from './progress.vue'

export default {
	install(Vue, options = {}) {
		// 注册组件
		Vue.component(ProgressBar.name, ProgressBar)
		// 创建一个子类
		const Component = Vue.extend(ProgressBar)
		// 获取自定义属性
		const { autoFinish, ...res } = options
		// 创建组件实例
		const vm = new Component({
			data: {
				autoFinish: typeof (autoFinish) === 'boolean' ? autoFinish : true
			}
		})
		// 合并自定义属性
		options = Object.assign(vm.$props.options, res)
		// 合并新的props
		vm.$propsData = options
		vm.$mount()
		// 如果是服务端渲染那么不继续执行
		if (!vm.$isServer) {
			document.body.appendChild(vm.$el)
		}
		let timer = null
		const progress = {
			start() {
				if (vm.$isServer) return
				// 每次调用start都重新初始化一次
				vm.percent = 0
				vm.show = true
				vm.canSuccess = true
				// 定义一个增量，这个值可以改成一个参数
				const CUT_SCALE = 5
				// 定义每100ms来执行一次动画
				timer = setInterval(() => {
					// 每次执行增量动画
					this.increase((CUT_SCALE - 1) * Math.random() + 1)
					// 如果进度大于95%，并设置了自动完成，那么执行结束动作
					if (vm.percent > 95 && vm.autoFinish) {
						this.finish()
					}
				})
			},
			increase (cut) {
				vm.percent = Math.min(99, vm.percent + cut)
			},
			hide () {
				clearInterval(timer)
				/**
				 * 这里面有2个定时器，外层定时器是让用户看到进度已经完成啦
				 * 内层定时器，由于opacity消失需要一段过渡时间，所以要等它完成后再将其进度置为0，等待下次调用
				 * 如果不延迟，那么会看到进度从100到0的动画
				 */
				setTimeout(() => {
					vm.show = false
					setTimeout(() => {
						vm.percent = 0
						timer = null 
					}, vm.options.transition.opacitySpeed)
				}, vm.options.transition.duration)
			},
			finish () {
				if (vm.$isServer) return
				vm.percent = 100
				this.hide()
			},
			fail () {
				if (vm.$isServer) return
				// 修改未成功的状态，实际效果就是改变最后的颜色
				vm.canSuccess = false
				vm.percent = 100
				this.hide()
			}
		}
		// 挂载到全局
		Vue.prototype.$progress = progress
	}
}