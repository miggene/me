import { _decorator, Component, director, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {
	@property(Node)
	ndStart: Node;
	start() {
		tween(this.ndStart.getComponent(UIOpacity))
			.repeatForever(
				tween(this.ndStart.getComponent(UIOpacity))
					.to(1, { opacity: 0 })
					.to(1, { opacity: 255 })
					.delay(0.5)
			)
			.start();
	}

	update(deltaTime: number) {}

	onBtnClick() {
		director.loadScene('MainScene');
	}
}
