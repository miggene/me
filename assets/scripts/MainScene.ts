import { _decorator, Component, instantiate, Node } from 'cc';
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
