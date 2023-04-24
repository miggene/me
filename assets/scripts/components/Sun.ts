import { _decorator, Component, dragonBones, macro, Node } from 'cc';
import ObserverMgr from '../core/observer/ObserverMgr';
import Msg from '../core/msg/Msg';
const { ccclass, property } = _decorator;

@ccclass('Sun')
export class Sun extends Component {
	private timer = 0;
	start() {
		this.schedule(this.updateTimer, 1, macro.REPEAT_FOREVER, 0);
	}

	update(deltaTime: number) {}
	updateTimer() {
		this.timer++;
		switch (this.timer) {
			case 10:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Sun, 1);
				break;
			case 20:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Sun, 2);
				break;
			case 30:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Sun, 3);
				break;
			case 40:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Sun, 4);
				break;
			default:
				break;
		}
	}

	protected onDestroy(): void {
		this.unschedule(this.updateTimer);
	}
}
