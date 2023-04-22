import { _decorator, Component } from 'cc';
import ObserverMgr from './ObserverMgr';
const { ccclass, property } = _decorator;

@ccclass('Observer')
export class Observer extends Component {
	onEnable() {
		this.initMsg();
	}

	onDisable() {
		ObserverMgr.instance.removeEventListenerWithTarget(this);
	}

	onDestroy() {
		ObserverMgr.instance.removeEventListenerWithTarget(this);
	}

	start() {}

	update(deltaTime: number) {}

	public initMsg() {
		const msgList = this.getMsgList();
		if (msgList) {
			for (const msg of msgList) {
				ObserverMgr.instance.addEventListener(msg, this.onMsg, this);
			}
		}
	}

	public getMsgList(): string[] {
		return [];
	}

	public onMsg(msg, data) {}
}
