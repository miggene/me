import {
	_decorator,
	Color,
	Component,
	Label,
	math,
	Node,
	Sprite,
	UITransform,
} from 'cc';
import { getAllChildrenOfTargetNode } from '../core/utils/Utils';
import { Observer } from '../core/observer/Observer';
import Msg from '../core/msg/Msg';
import { COLOR_STATUS, DAY_HEX, NIGHT_HEX } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('ColorExchange')
export class ColorExchange extends Observer {
	private allChildren: Node[] = [];
	// private status: COLOR_STATUS = COLOR_STATUS.DAY;

	private _status: COLOR_STATUS;
	public get status(): COLOR_STATUS {
		return this._status;
	}
	public set status(v: COLOR_STATUS) {
		if (this._status === v) return;
		this._status = v;
	}

	public getMsgList(): string[] {
		return [Msg.LocalMsg.ExchangeColor];
	}

	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.ExchangeColor) {
			this.updateColor();
		}
	}

	start() {
		this.allChildren = getAllChildrenOfTargetNode(this.node);
	}

	update(deltaTime: number) {}

	updateColor() {
		for (const child of this.allChildren) {
			const sprite = child.getComponent(Sprite);
			if (sprite) {
				const dayColor = new math.Color(DAY_HEX);
				const nightColor = new math.Color(NIGHT_HEX);
				if (sprite.color.equals(dayColor)) {
					sprite.color = nightColor;
				} else {
					sprite.color = dayColor;
				}
			}
			const label = child.getComponent(Label);
			if (label) {
				const dayColor = new math.Color(DAY_HEX);
				const nightColor = new math.Color(NIGHT_HEX);
				if (label.color.equals(dayColor)) {
					label.color = nightColor;
				} else {
					label.color = dayColor;
				}
			}
		}
	}
}
