import { _decorator, Component, macro, Node } from 'cc';
import Msg from '../core/msg/Msg';
import ObserverMgr from '../core/observer/ObserverMgr';
const { ccclass, property } = _decorator;

@ccclass('Moon')
export class Moon extends Component {
	private timer = 0;
	public getMsgList(): string[] {
		return [Msg.LocalMsg.GameFail, Msg.LocalMsg.GameWin];
	}
	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.GameFail || msg === Msg.LocalMsg.GameWin) {
			this.unschedule(this.updateTimer);
		}
	}
	start() {
		this.schedule(this.updateTimer, 1, macro.REPEAT_FOREVER, 0);
	}

	update(deltaTime: number) {}
	updateTimer() {
		this.timer++;
		switch (this.timer) {
			case 10:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Moon, 1);
				break;
			case 20:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Moon, 2);
				break;
			case 30:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Moon, 3);
				break;
			case 40:
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Moon, 4);
				break;
			default:
				break;
		}
	}

	onDestroy(): void {
		this.unschedule(this.updateTimer);
	}
}
