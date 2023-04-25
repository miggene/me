import {
	_decorator,
	Component,
	director,
	EventKeyboard,
	Input,
	input,
	KeyCode,
	macro,
	Sprite,
	tween,
	v3,
	Vec3,
} from 'cc';
import {
	COLOR_STATUS,
	HOUR_SPIN_ANGLE_PER_SECOND,
	MIDDLE_TIME,
	TOTAL_TIME,
} from '../Constant';
import ObserverMgr from '../core/observer/ObserverMgr';
import Msg from '../core/msg/Msg';
import { Observer } from '../core/observer/Observer';
const { ccclass, property } = _decorator;

@ccclass('FailClock')
export class FailClock extends Observer {
	@property(Sprite)
	spHourPin: Sprite;

	private basePos: Vec3;

	private status = COLOR_STATUS.DAY;

	private _curTime: number = 0;
	public get curTime(): number {
		return this._curTime;
	}
	public set curTime(v: number) {
		if (this._curTime === v) return;
		this._curTime = v;
		this.spHourPin.node.angle = -this.curTime * HOUR_SPIN_ANGLE_PER_SECOND;

		if (this._curTime === MIDDLE_TIME) {
			if (this.status === COLOR_STATUS.DAY) {
				this.status = COLOR_STATUS.NIGHT;
			} else if (this.status === COLOR_STATUS.NIGHT) {
				this.status = COLOR_STATUS.DAY;
			}
			ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.ExchangeColor, this.status);
			ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.ShowMoonOrSun, this.status);
		}
	}

	public getMsgList(): string[] {
		return [
			Msg.LocalMsg.GameWin,
			Msg.LocalMsg.GameFail,
			// Msg.LocalMsg.DownClock,
			// Msg.LocalMsg.UpClock,
		];
	}

	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.GameWin) {
			this.stopClock();

			return;
		}
		if (msg === Msg.LocalMsg.GameFail) {
			this.stopClock();
			// tween(this.node)
			// 	.to(0.5, { position: v3(0, 200) })
			// 	.call(() => {
			// 		this.node.getChildByName('btnRetry').active = true;
			// 	})
			// 	.start();
			return;
		}
		// if (msg === Msg.LocalMsg.DownClock) {
		// 	const { x, y, z } = this.node.getPosition();
		// 	this.node.setPosition(x, y - 200, z);
		// 	return;
		// }
		// if (msg === Msg.LocalMsg.UpClock) {
		// 	this.node.setPosition(this.basePos);
		// }
	}

	protected onLoad(): void {
		this.basePos = this.node.position.clone();
	}

	onEnable(): void {
		super.onEnable();
	}

	start() {
		this.runClock();
	}

	update(deltaTime: number) {}

	private runClock() {
		this.schedule(this.refreshClock, 1, macro.REPEAT_FOREVER);
	}
	private refreshClock() {
		this.curTime += 1;
		if (this.curTime > 60) {
			director.loadScene('MainScene');
		}
	}

	private stopClock() {
		this.unschedule(this.refreshClock);
	}

	onDisable(): void {
		super.onDisable();
	}
}
