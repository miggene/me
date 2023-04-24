import { _decorator, Component, dragonBones, Node } from 'cc';
import { Observer } from '../core/observer/Observer';
import Msg from '../core/msg/Msg';
import { COLOR_STATUS } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('Flower')
export class Flower extends Observer {
	public getMsgList(): string[] {
		return [Msg.LocalMsg.ShowMoonOrSun];
	}
	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.ShowMoonOrSun) {
			if (data === COLOR_STATUS.DAY) {
				this.node
					.getComponent(dragonBones.ArmatureDisplay)
					.playAnimation('on', 1);
			}
			if (data === COLOR_STATUS.NIGHT) {
				this.node
					.getComponent(dragonBones.ArmatureDisplay)
					.playAnimation('off', 1);
			}
		}
	}
	start() {}

	update(deltaTime: number) {}
}
