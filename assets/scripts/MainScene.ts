import {
	_decorator,
	Component,
	EPhysics2DDrawFlags,
	instantiate,
	Node,
	PhysicsSystem2D,
	randomRangeInt,
	tween,
	UIOpacity,
} from 'cc';
import { Observer } from './core/observer/Observer';
import ResMgr from './core/mgrs/ResMgr';
import Msg from './core/msg/Msg';
import { COLOR_STATUS } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Observer {
	@property(Node)
	uiLayer: Node;

	@property(Node)
	levelLayer: Node;

	private curLevel = 1; // 当前关卡

	public getMsgList(): string[] {
		return [
			Msg.LocalMsg.ShowMoonOrSun,
			Msg.LocalMsg.NextLevel,
			Msg.LocalMsg.Retry,
		];
	}

	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.ShowMoonOrSun) {
			const bShow = randomRangeInt(0, 2) > 0;
			if (data === COLOR_STATUS.DAY) {
				this.levelLayer.getChildByName('Moon') &&
					this.levelLayer.getChildByName('Moon').destroy();
			} else if (data === COLOR_STATUS.NIGHT) {
				this.levelLayer.getChildByName('Sun') &&
					this.levelLayer.getChildByName('Sun').destroy();
			}

			if (bShow) {
				const type = data === COLOR_STATUS.DAY ? 'Sun' : 'Moon';
				this.addSunOrMoon(type);
			}
			return;
		}
		if (msg === Msg.LocalMsg.NextLevel) {
			this.fadeOutAction(this.nextLevel);
			return;
		}
		if (msg === Msg.LocalMsg.Retry) {
			// this.loadLevel(this.curLevel);
			this.fadeOutAction(this.retryLevel);
		}
	}

	start() {
		// PhysicsSystem2D.instance.debugDrawFlags =
		// 	EPhysics2DDrawFlags.Aabb |
		// 	EPhysics2DDrawFlags.Pair |
		// 	EPhysics2DDrawFlags.CenterOfMass |
		// 	EPhysics2DDrawFlags.Joint |
		// 	EPhysics2DDrawFlags.Shape;

		this.loadLevel(this.curLevel);
	}

	update(deltaTime: number) {}

	async loadLevel(level: number) {
		randomRangeInt(0, 2) > 0 && this.addSunOrMoon('Sun');
		ResMgr.instance
			.loadPrefab(`prefabs/levels/Level${level}`)
			.then((prefab) => {
				const levelNode = instantiate(prefab);
				this.levelLayer.addChild(levelNode);
			})
			.catch((err) => console.error(err));
	}

	nextLevel() {
		this.curLevel++;
		this.fadeInAction(() => {
			this.loadLevel(this.curLevel);
		});
	}
	retryLevel() {
		this.fadeInAction(() => {
			this.loadLevel(this.curLevel);
		});
	}

	async addSunOrMoon(type: 'Sun' | 'Moon') {
		ResMgr.instance
			.loadPrefab(`prefabs/${type}`)
			.then((prefab) => {
				const prfNode = instantiate(prefab);
				this.levelLayer.addChild(prfNode);
			})
			.catch((err) => console.error(err));
	}

	fadeOutAction(cb: Function) {
		console.log(
			'this.levelLayer.getComponent(UIOpacity)',
			this.levelLayer.getComponent(UIOpacity)
		);
		tween(this.levelLayer.getComponent(UIOpacity))
			.to(1, { opacity: 0 })
			.call(() => {
				this.levelLayer.destroyAllChildren();
				cb && cb();
			})
			.start();
	}
	fadeInAction(cb?: Function) {
		tween(this.levelLayer.getComponent(UIOpacity))
			.to(1, { opacity: 255 })
			.call(() => {
				this.levelLayer.destroyAllChildren();
				if (cb) cb();
			})
			.start();
	}
}
