import {
	_decorator,
	Component,
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

@ccclass('Clock')
export class Clock extends Observer {
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
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
		input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
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
		if (this.curTime >= TOTAL_TIME) {
			this.unschedule(this.refreshClock);
			console.log('done');
			ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.TimeOut, null);
		}
	}

	private stopClock() {
		this.unschedule(this.refreshClock);
	}

	onDisable(): void {
		super.onDisable();
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
	}

	onKeyDown(e: EventKeyboard) {
		switch (e.keyCode) {
			// case KeyCode.ARROW_UP:
			// 	this.stopClock();
			// 	this.curTime -= 1;
			// 	this.curTime = Math.max(0, this.curTime);

			// 	if (this.curTime <= 0) {
			// 		console.log('done 0');
			// 	}
			// 	break;
			case KeyCode.KEY_W:
				this.stopClock();
				this.curTime += 1;
				this.curTime = Math.min(720, this.curTime);
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PrinceAngry, 1);
				if (this.curTime >= 720) {
					this.unschedule(this.runClock);
					console.log('done');
					ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.TimeOut, null);
				}

				break;
			default:
				break;
		}
	}
	onKeyPressing(e: EventKeyboard) {
		switch (e.keyCode) {
			// case KeyCode.ARROW_UP:
			// 	this.stopClock();
			// 	this.curTime -= 1;
			// 	this.curTime = Math.max(0, this.curTime);
			// 	if (this.curTime <= 0) {
			// 		console.log('done 0');
			// 	}
			// 	console.log('this.curTime', this.curTime);
			// 	break;
			case KeyCode.KEY_W:
				this.stopClock();
				this.curTime += 1;
				this.curTime = Math.min(TOTAL_TIME, this.curTime);
				if (this.curTime >= TOTAL_TIME) {
					this.unschedule(this.runClock);
					ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.TimeOut, null);
					console.log('done');
				}
				break;
			default:
				break;
		}
	}
	onKeyUp(e: EventKeyboard) {
		switch (e.keyCode) {
			// case KeyCode.ARROW_UP:
			// 	this.runClock();
			// 	break;
			case KeyCode.KEY_W:
				this.runClock();
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PrinceAngry, 0);
				break;
			default:
				break;
		}
	}

	retry() {
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/retry');
		tween(this.node)
			.repeat(120, tween(this.node).by(0.01, { angle: 6 }))
			.call(() => {
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Retry, null);
			})
			.start();
	}
}
