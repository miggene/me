import {
	EventKeyboard,
	Input,
	KeyCode,
	Node,
	RigidBody2D,
	input,
	v2,
	v3,
} from 'cc';
import { _decorator, Component, dragonBones } from 'cc';
import { DIRECTION, SPEED_HORIZONTAL, SPEED_VERTICAL } from '../Constant';
const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Component {
	@property(dragonBones.ArmatureDisplay)
	drgCube: dragonBones.ArmatureDisplay;

	private direction: DIRECTION = DIRECTION.NONE;

	onEnable() {
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
	}

	start() {}

	update(deltaTime: number) {}

	onDisable() {
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
	}

	onKeyDown(e: EventKeyboard) {
		const rigidBody2D = this.drgCube.node.getComponent(RigidBody2D);
		const { x, y } = rigidBody2D.linearVelocity;
		switch (e.keyCode) {
			case KeyCode.KEY_A:
				this.direction = DIRECTION.LEFT;

				rigidBody2D.linearVelocity = v2(-SPEED_HORIZONTAL, y);
				break;
			case KeyCode.KEY_D:
				this.direction = DIRECTION.RIGHT;
				rigidBody2D.linearVelocity = v2(SPEED_HORIZONTAL, y);
				break;

			default:
				break;
		}
	}
	onKeyUp(e: EventKeyboard) {
		const rigidBody2D = this.drgCube.node.getComponent(RigidBody2D);
		const { x, y } = rigidBody2D.linearVelocity;
		switch (e.keyCode) {
			case KeyCode.KEY_A:
				this.direction = DIRECTION.NONE;
				rigidBody2D.linearVelocity = v2(0, y);
				break;
			case KeyCode.KEY_D:
				this.direction = DIRECTION.NONE;
				rigidBody2D.linearVelocity = v2(0, y);
				break;
			case KeyCode.SPACE:
				this.direction = DIRECTION.UP;
				rigidBody2D.linearVelocity = v2(x, SPEED_VERTICAL);
				break;
			default:
				break;
		}
	}
}
