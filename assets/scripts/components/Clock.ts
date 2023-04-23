import {
	_decorator,
	Component,
	EventKeyboard,
	Input,
	input,
	KeyCode,
	macro,
	Sprite,
} from 'cc';
import {
	COLOR_STATUS,
	HOUR_SPIN_ANGLE_PER_SECOND,
	MIDDLE_TIME,
	TOTAL_TIME,
} from '../Constant';
import ObserverMgr from '../core/observer/ObserverMgr';
import Msg from '../core/msg/Msg';
const { ccclass, property } = _decorator;

@ccclass('Clock')
export class Clock extends Component {
	@property(Sprite)
	spHourPin: Sprite;

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

	protected onEnable(): void {
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
		}
	}

	private stopClock() {
		this.unschedule(this.refreshClock);
	}

	protected onDisable(): void {
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
	}

	onKeyDown(e: EventKeyboard) {
		switch (e.keyCode) {
			case KeyCode.ARROW_UP:
				this.stopClock();
				this.curTime -= 1;
				this.curTime = Math.max(0, this.curTime);
				if (this.curTime <= 0) {
					console.log('done 0');
				}
				break;
			case KeyCode.ARROW_DOWN:
				this.stopClock();
				this.curTime += 1;
				this.curTime = Math.min(720, this.curTime);
				if (this.curTime >= 720) {
					this.unschedule(this.runClock);
					console.log('done');
				}
				break;
			default:
				break;
		}
	}
	onKeyPressing(e: EventKeyboard) {
		switch (e.keyCode) {
			case KeyCode.ARROW_UP:
				this.stopClock();
				this.curTime -= 1;
				this.curTime = Math.max(0, this.curTime);
				if (this.curTime <= 0) {
					console.log('done 0');
				}
				console.log('this.curTime', this.curTime);
				break;
			case KeyCode.ARROW_DOWN:
				this.stopClock();
				this.curTime += 1;
				this.curTime = Math.min(TOTAL_TIME, this.curTime);
				if (this.curTime >= TOTAL_TIME) {
					this.unschedule(this.runClock);
					console.log('done');
				}
				break;
			default:
				break;
		}
	}
	onKeyUp(e: EventKeyboard) {
		switch (e.keyCode) {
			case KeyCode.ARROW_UP:
				this.runClock();
				break;
			case KeyCode.ARROW_DOWN:
				this.runClock();
				break;
			default:
				break;
		}
	}
}
