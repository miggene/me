import {
	_decorator,
	Component,
	EPhysics2DDrawFlags,
	instantiate,
	Node,
	PhysicsSystem2D,
} from 'cc';
import { Observer } from './core/observer/Observer';
import ResMgr from './core/mgrs/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Observer {
	// onEnable(): void {
	// 	super.onEnable();
	// }

	public getMsgList(): string[] {
		return [];
	}

	public onMsg(msg: any, data: any): void {}

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
				this.node.addChild(levelNode);
			})
			.catch((err) => console.error(err));
	}

	update(deltaTime: number) {}
}
