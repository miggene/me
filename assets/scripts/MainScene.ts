import {
	_decorator,
	AudioSource,
	Component,
	EPhysics2DDrawFlags,
	instantiate,
	math,
	Node,
	PhysicsSystem2D,
	randomRangeInt,
	Sprite,
	tween,
	UIOpacity,
} from 'cc';
import { Observer } from './core/observer/Observer';
import ResMgr from './core/mgrs/ResMgr';
import Msg from './core/msg/Msg';
import { COLOR_STATUS, DAY_HEX } from './Constant';
import AudioMgr from './core/mgrs/AudioMgr';
import ObserverMgr from './core/observer/ObserverMgr';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Observer {
	@property(Sprite)
	spBg: Sprite;

	@property(Node)
	uiLayer: Node;

	@property(Node)
	levelLayer: Node;

	@property(AudioSource)
	audioSource: AudioSource;

	private curLevel = 1; // 当前关卡

	public getMsgList(): string[] {
		return [
			Msg.LocalMsg.ShowMoonOrSun,
			Msg.LocalMsg.NextLevel,
			Msg.LocalMsg.Retry,
			Msg.LocalMsg.PlaySound,
		];
	}

	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.Retry) {
			this.retryLevel();
		}
		if (msg === Msg.LocalMsg.PlaySound) {
			ResMgr.instance
				.loadAudioClips(data)
				.then((clip) => {
					AudioMgr.instance.playSound(clip);
				})
				.catch((err) => console.error(err));
		}
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
			this.nextLevel();
			return;
		}
	}

	start() {
		// PhysicsSystem2D.instance.debugDrawFlags =
		// 	EPhysics2DDrawFlags.Aabb |
		// 	EPhysics2DDrawFlags.Pair |
		// 	EPhysics2DDrawFlags.CenterOfMass |
		// 	EPhysics2DDrawFlags.Joint |
		// 	EPhysics2DDrawFlags.Shape;

		Promise.all([
			ResMgr.instance.preloadAudioDirs('sounds'),
			AudioMgr.instance.init(this.audioSource),
		]).then(() => {
			this.loadLevel(this.curLevel);
		});
	}

	update(deltaTime: number) {}

	async loadLevel(level: number) {
		try {
			const prefab = await ResMgr.instance.loadPrefab(
				`prefabs/levels/Level${level}`
			);
			const levelNode = instantiate(prefab);
			this.levelLayer.addChild(levelNode);
			randomRangeInt(0, 2) > 0 && (await this.addSunOrMoon('Sun'));
		} catch (error) {
			console.error(error);
		}
	}

	nextLevel() {
		this.curLevel++;
		if (this.curLevel > 3) this.curLevel = 1;
		this.levelLayer.destroyAllChildren();
		this.loadLevel(this.curLevel);
		// ObserverMgr.instance.dispatchMsg(
		// 	Msg.LocalMsg.ExchangeColor,
		// 	COLOR_STATUS.DAY
		// );
		this.spBg.color = new math.Color(DAY_HEX);
	}
	retryLevel() {
		this.levelLayer.destroyAllChildren();
		this.loadLevel(this.curLevel);
		// ObserverMgr.instance.dispatchMsg(
		// 	Msg.LocalMsg.ExchangeColor,
		// 	COLOR_STATUS.DAY
		// );
		this.spBg.color = new math.Color(DAY_HEX);
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
}
