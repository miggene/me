import {
	Collider2D,
	Contact2DType,
	EventKeyboard,
	IPhysics2DContact,
	Input,
	KeyCode,
	Label,
	Node,
	RigidBody2D,
	UITransform,
	input,
	math,
	tween,
	v2,
	v3,
} from 'cc';
import { _decorator, Component, dragonBones } from 'cc';
import {
	COLOR_STATUS,
	DAY_HEX,
	DIRECTION,
	GAME_STATUS,
	NIGHT_HEX,
	PRINCE_VELOCITY_Y,
	SPEED_HORIZONTAL,
	SPEED_VERTICAL,
} from '../Constant';
import { Observer } from '../core/observer/Observer';
import Msg from '../core/msg/Msg';
import ObserverMgr from '../core/observer/ObserverMgr';
import { ColorExchange } from './ColorExchange';

const { ccclass, property } = _decorator;

@ccclass('Level')
export class Level extends Observer {
	@property(dragonBones.ArmatureDisplay)
	drgCube: dragonBones.ArmatureDisplay;

	@property(dragonBones.ArmatureDisplay)
	drgPrince: dragonBones.ArmatureDisplay;

	@property(dragonBones.ArmatureDisplay)
	drgLove: dragonBones.ArmatureDisplay;

	@property([Node])
	dayIces: Node[] = [];
	@property([Node])
	nightIce: Node[] = [];

	private direction: DIRECTION = DIRECTION.NONE;
	private gameStatus: GAME_STATUS = GAME_STATUS.START;
	private jumpTimes = 2;
	private colorStatus: COLOR_STATUS = COLOR_STATUS.DAY;

	onEnable() {
		super.onEnable();
		this.onInputListener();
		this.onCubePhysicsListener();
		this.onCubeListener();
		this.onPrinceListener();
	}

	public getMsgList(): string[] {
		return [
			Msg.LocalMsg.ShowMoonOrSun,
			Msg.LocalMsg.GameFail,
			Msg.LocalMsg.Sun,
			Msg.LocalMsg.TimeOut,
			Msg.LocalMsg.PrinceAngry,
			Msg.LocalMsg.Moon,
			Msg.LocalMsg.PrinceStoped,
		];
	}

	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.ShowMoonOrSun) {
			this.colorStatus = data;
			if (data === COLOR_STATUS.DAY) {
				this.drgCube.playAnimation('d_standby', 0);
				this.drgPrince.playAnimation('d_standby', 0);
				this.dayIces.forEach((v) => (v.active = true));
				this.nightIce.forEach((v) => (v.active = false));
			}
			if (data === COLOR_STATUS.NIGHT) {
				this.drgCube.playAnimation('n_standby', 0);
				this.drgPrince.playAnimation('n_standby', 0);
				this.dayIces.forEach((v) => (v.active = false));
				this.nightIce.forEach((v) => (v.active = true));
			}
			return;
		}

		if (msg === Msg.LocalMsg.GameFail) {
			this.offInputListener();
			this.offCubePhysicsListener();
			this.offCubeListener();
			this.offPrinceListener();
			return;
		}

		if (msg === Msg.LocalMsg.Sun) {
			const name =
				this.colorStatus === COLOR_STATUS.DAY ? `d_sun${data}` : `n_sun${data}`;
			this.drgCube.playAnimation(name, 0);
			return;
		}
		if (msg === Msg.LocalMsg.Moon) {
			const name =
				this.colorStatus === COLOR_STATUS.DAY ? `d_sun${data}` : `n_sun${data}`;
			this.drgCube.playAnimation(name, 0);
		}

		if (msg === Msg.LocalMsg.TimeOut) {
			this.fail();
			return;
		}

		if (msg === Msg.LocalMsg.PrinceAngry) {
			let name = '';
			if (this.colorStatus === COLOR_STATUS.DAY && data === 1) {
				name = 'd_angry_1';
			}

			if (this.colorStatus === COLOR_STATUS.NIGHT && data === 1) {
				name = 'n_angry_1';
			}

			if (this.colorStatus === COLOR_STATUS.DAY && data === 0) {
				name = 'd_standby';
			}

			if (this.colorStatus === COLOR_STATUS.NIGHT && data === 0) {
				name = 'n_standby';
			}
			this.drgPrince.node.getComponent(RigidBody2D).linearVelocity = v2(
				0,
				data === 1 ? PRINCE_VELOCITY_Y.ANGRY : PRINCE_VELOCITY_Y.NORMAL
			);
			this.drgPrince.playAnimation(name, 0);
		}
		if (msg === Msg.LocalMsg.PrinceStoped) {
			const body = this.drgPrince.node.getComponent(RigidBody2D);
			body.linearVelocity = v2(0, PRINCE_VELOCITY_Y.STOP);
		}
	}

	start() {}

	update(deltaTime: number) {
		if (
			this.gameStatus === GAME_STATUS.FAIL ||
			this.gameStatus === GAME_STATUS.WIN
		)
			return;

		if (
			this.drgCube.node.getPosition().y <
			-this.node.getComponent(UITransform).height / 2
		) {
			this.fail();
			return;
		}

		if (
			this.drgPrince.node.getPosition().y >
			this.node.getComponent(UITransform).height / 2
		) {
			this.fail();
			return;
		}
		if (this.drgCube.node.getComponent(RigidBody2D).linearVelocity.y === 0) {
			this.jumpTimes = 2;
		}
	}

	onDisable() {
		super.onDisable();
		this.offInputListener();
		this.offCubePhysicsListener();
		this.offCubeListener();
		this.offPrinceListener();
	}

	onInputListener() {
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
		input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
	}
	offInputListener() {
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
		input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
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
			case KeyCode.SPACE:
				if (this.jumpTimes > 0) {
					this.direction = DIRECTION.UP;
					rigidBody2D.linearVelocity = v2(x, SPEED_VERTICAL);
					this.jumpTimes--;
					ObserverMgr.instance.dispatchMsg(
						Msg.LocalMsg.PlaySound,
						'sounds/jump'
					);
				}

			default:
				break;
		}
	}

	onKeyPressing(e: EventKeyboard) {
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

			default:
				break;
		}
	}

	onCubePhysicsListener() {
		const collider = this.drgCube.node.getComponent(Collider2D);
		collider.on(Contact2DType.BEGIN_CONTACT, this.onCubeBeginContact, this);
		collider.on(Contact2DType.END_CONTACT, this.onCubeBeginContact, this);
	}

	onCubeBeginContact(
		selfCollider: Collider2D,
		otherCollider: Collider2D,
		contact: IPhysics2DContact | null
	) {
		const otherName = otherCollider.node.name;
		const selfName = selfCollider.node.name;
		if (selfName === 'Cube' && (otherName === 'Stin' || otherName === 'Star')) {
			console.log('end');
			this.fail();
			return;
		}
		if (selfName === 'Cube' && otherName === 'Prince') {
			console.log('win');
			this.win();
			return;
		}
		if (selfName === 'Cube' && otherName === 'Flower') {
			const body = this.drgCube.node.getComponent(RigidBody2D);
			body.applyLinearImpulseToCenter(v2(0, 100), true);
			ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/jump');
			return;
		}
	}

	fail() {
		this.gameStatus = GAME_STATUS.FAIL;
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.GameFail, null);
		this.offCubePhysicsListener();
		this.offInputListener();
		this.showFail();
	}
	win() {
		this.gameStatus = GAME_STATUS.WIN;
		this.offCubePhysicsListener();
		this.offInputListener();
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.GameWin, null);
		this.showWin();
	}

	onCubeEndContact(
		selfCollider: Collider2D,
		otherCollider: Collider2D,
		contace: IPhysics2DContact
	) {}

	offCubePhysicsListener() {
		const collider = this.drgCube.node.getComponent(Collider2D);
		collider?.off(Contact2DType.BEGIN_CONTACT, this.onCubeBeginContact, this);
		collider?.off(Contact2DType.END_CONTACT, this.onCubeBeginContact, this);
	}

	showWin() {
		this.drgCube.node.getComponent(RigidBody2D)?.destroy();
		this.drgCube.node.getComponent(Collider2D)?.destroy();
		this.drgPrince.node.getComponent(RigidBody2D)?.destroy();
		this.drgPrince.node.getComponent(Collider2D)?.destroy();
		this.playLove();
		this.playCubeWin();
		this.playPrinceWin();
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/win');
	}

	showFail() {
		this.drgCube.node.getComponent(RigidBody2D)?.destroy();
		this.drgCube.node.getComponent(Collider2D)?.destroy();
		this.drgPrince.node.getComponent(RigidBody2D)?.destroy();
		this.drgPrince.node.getComponent(Collider2D)?.destroy();

		if (this.colorStatus === COLOR_STATUS.DAY)
			this.drgCube.playAnimation('d_die', 1);
		if (this.colorStatus === COLOR_STATUS.NIGHT)
			this.drgCube.playAnimation('n_die', 1);

		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/fail');
	}

	playLove() {
		this.drgLove.node.active = true;
		const label = this.drgLove.node
			.getChildByName('btnNext')
			.getComponent(Label);

		this.onLoveListener();
		if (this.colorStatus === COLOR_STATUS.DAY) {
			this.drgLove.playAnimation('d_appear', 1);
			label.color = new math.Color(NIGHT_HEX);
			return;
		}
		if (this.colorStatus === COLOR_STATUS.NIGHT) {
			this.drgLove.playAnimation('n_appear', 1);
			label.color = new math.Color(DAY_HEX);
		}
	}

	onLoveListener() {
		this.drgLove.addEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onLoveCompleted,
			this
		);
	}

	offLoveListener() {
		this.drgLove.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onLoveCompleted,
			this
		);
	}

	onLoveCompleted(event: { type: any; animationState: { name: string } }) {
		const { type, animationState } = event;
		if (
			type === dragonBones.EventObject.COMPLETE &&
			animationState.name === 'd_appear'
		) {
			this.drgLove.playAnimation('d_standby', 0);
		} else if (
			type === dragonBones.EventObject.COMPLETE &&
			animationState.name === 'n_appear'
		) {
			this.drgLove.playAnimation('n_standby', 0);
		}
	}

	playCubeWin() {
		if (this.colorStatus === COLOR_STATUS.DAY) {
			this.drgCube.playAnimation('d_love1', 1);
		} else if (this.colorStatus === COLOR_STATUS.NIGHT) {
			this.drgCube.playAnimation('n_love1', 1);
		}
	}

	onCubeListener() {
		this.drgCube.addEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onCubeCompleted,
			this
		);
	}

	offCubeListener() {
		this.drgCube.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onCubeCompleted,
			this
		);
	}

	onCubeCompleted(event: { type: any; animationState: { name: string } }) {
		const { type, animationState } = event;
		if (
			type === dragonBones.EventObject.COMPLETE &&
			animationState.name === 'd_love1'
		) {
			this.drgCube.playAnimation('d_love2', 0);
		}
		if (
			type === dragonBones.EventObject.COMPLETE &&
			animationState.name === 'n_love1'
		) {
			this.drgCube.playAnimation('n_love2', 0);
		}
	}

	playPrinceWin() {
		if (this.colorStatus === COLOR_STATUS.DAY) {
			this.drgPrince.playAnimation('d_love_1', 1);
		} else if (this.colorStatus === COLOR_STATUS.NIGHT) {
			this.drgPrince.playAnimation('n_love_1', 1);
		}
	}

	onPrinceListener() {
		this.drgPrince.addEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onPrinceCompleted,
			this
		);
	}

	offPrinceListener() {
		this.drgPrince.removeEventListener(
			dragonBones.EventObject.COMPLETE,
			this.onPrinceCompleted,
			this
		);
	}

	onPrinceCompleted(event: { type: any; animationState: { name: string } }) {
		const { type, animationState } = event;
		if (
			type === dragonBones.EventObject.COMPLETE &&
			animationState.name === 'd_love_1'
		) {
			this.drgPrince.playAnimation('d_love_2', 0);
		}
		if (
			type === dragonBones.EventObject.COMPLETE &&
			animationState.name === 'n_love_1'
		) {
			this.drgPrince.playAnimation('n_love_2', 0);
		}
	}
}
