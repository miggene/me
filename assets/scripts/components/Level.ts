import { Node } from 'cc';
import { _decorator, Component, dragonBones, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {
	@property(dragonBones.Armature)
	drgCube: dragonBones.Armature;

	onEnable() {
		// super.onEnable();
		this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
	}

	start() {}

	update(deltaTime: number) {}

	onDisable() {
		// super.onDisable();
		this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
	}

	onTouchStart(e: EventTouch) {
		const startPos = e.getStartLocation();
		const curPos = e.getLocation();
		console.log('startPos', startPos);
		console.log('curPos', curPos);
	}
	onTouchMove(e: EventTouch) {
		const startPos = e.getStartLocation();
		const curPos = e.getLocation();
		console.log('startPos1', startPos);
		console.log('curPos1', curPos);
	}
	onTouchEnd(e: EventTouch) {}
	onTouchCancel(e: EventTouch) {}
}
