import {
	_decorator,
	Component,
	EPhysics2DDrawFlags,
	instantiate,
	Node,
	PhysicsSystem2D,
	randomRangeInt,
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

	public getMsgList(): string[] {
		return [Msg.LocalMsg.ShowMoonOrSun];
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
			console.log('data', data);
			if (bShow) {
				ResMgr.instance
					.loadPrefab(`prefabs/${data === COLOR_STATUS.DAY ? 'Sun' : 'Moon'}`)
					.then((prefab) => {
						const prfNode = instantiate(prefab);
						this.levelLayer.addChild(prfNode);
					})
					.catch((err) => console.error(err));
			}
		}
	}

	start() {
		PhysicsSystem2D.instance.debugDrawFlags =
			EPhysics2DDrawFlags.Aabb |
			EPhysics2DDrawFlags.Pair |
			EPhysics2DDrawFlags.CenterOfMass |
			EPhysics2DDrawFlags.Joint |
			EPhysics2DDrawFlags.Shape;

		ResMgr.instance
			.loadPrefab('prefabs/levels/Level1')
			.then((prefab) => {
				const levelNode = instantiate(prefab);
				this.levelLayer.addChild(levelNode);
			})
			.catch((err) => console.error(err));
	}

	update(deltaTime: number) {}
}
