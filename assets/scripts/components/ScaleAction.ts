import { _decorator, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScaleAction')
export class ScaleAction extends Component {
	start() {
		tween(this.node)
			.repeatForever(
				tween(this.node)
					.to(0.2, { scale: v3(1.2, 1.2) })
					.to(0.2, { scale: v3(1, 1) })
			)
			.start();
	}

	update(deltaTime: number) {}
}
