import {
	_decorator,
	Collider2D,
	Component,
	Node,
	Sprite,
	SpriteFrame,
} from 'cc';
import { Observer } from '../core/observer/Observer';
import Msg from '../core/msg/Msg';
import { COLOR_STATUS } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('Ice')
export class Ice extends Observer {
	@property([SpriteFrame])
	iceSpriteFrames: SpriteFrame[] = [];

	private _status: COLOR_STATUS;
	public get status(): COLOR_STATUS {
		return this._status;
	}
	public set status(v: COLOR_STATUS) {
		this._status = v;
		this.node.getComponent(Sprite).spriteFrame =
			this.iceSpriteFrames[this._status];
	}

	public getMsgList(): string[] {
		return [Msg.LocalMsg.ShowMoonOrSun];
	}

	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.ShowMoonOrSun) {
			this.status = data;
			if (this.status === COLOR_STATUS.NIGHT) {
				this.node.getComponent(Collider2D).sensor = false;
			}
		}
	}

	start() {}

	update(deltaTime: number) {}
}
