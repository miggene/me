import { _decorator, Component, dragonBones, input, Input, Node, v3 } from 'cc';
import ObserverMgr from '../core/observer/ObserverMgr';
import Msg from '../core/msg/Msg';
const { ccclass, property } = _decorator;

@ccclass('Guild')
export class Guild extends Component {
	@property(dragonBones.ArmatureDisplay)
	drgNew: dragonBones.ArmatureDisplay;

	private step = 1;

	protected onEnable(): void {
		this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
	}

	protected onDisable(): void {
		this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
	}

	start() {
		this.playGuild();
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PrinceStoped, null);
	}

	playGuild() {
		this.drgNew.playAnimation(`d_${this.step}`, 0);
	}

	update(deltaTime: number) {}

	onTouchStart() {
		this.step++;
		if (this.step === 2) {
			const { x, y, z } = this.node.getPosition();
			this.node.setPosition(v3(0, 200));
		}
		if (this.step !== 2) {
			this.node.setPosition(v3(0, 0));
		}
		if (this.step > 3) {
			this.node.destroy();
			ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.FinishGuild, null);
			return;
		}
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/jump');
		this.playGuild();
	}
	onKeyDown() {
		this.step++;
		if (this.step > 3) {
			this.node.destroy();
			ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.FinishGuild, null);
			return;
		}
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/jump');
		this.playGuild();
	}
}
