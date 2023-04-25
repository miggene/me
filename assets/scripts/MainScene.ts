import {
	_decorator,
	AudioSource,
	Component,
	director,
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
import { Word } from './components/Word';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Observer {
	@property(Sprite)
	spBg: Sprite;

	@property(Node)
	uiLayer: Node;

	@property(Node)
	levelLayer: Node;

	@property(Node)
	failLayer: Node;

	@property(Node)
	ndClock: Node;

	@property(AudioSource)
	audioSource: AudioSource;

	private curLevel = 1; // 当前关卡
	private hasGuilded = false;

	public getMsgList(): string[] {
		return [
			Msg.LocalMsg.ShowMoonOrSun,
			Msg.LocalMsg.NextLevel,
			Msg.LocalMsg.Retry,
			Msg.LocalMsg.PlaySound,
			Msg.LocalMsg.FinishGuild,
			Msg.LocalMsg.GameFail,
			// Msg.LocalMsg.LoadGuild,
			Msg.LocalMsg.LoadLevel,
			Msg.LocalMsg.NextWord,
		];
	}

	public onMsg(msg: any, data: any): void {
		if (msg === Msg.LocalMsg.Retry) {
			this.retryWord();
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
		if (msg === Msg.LocalMsg.NextWord) {
			this.nextWord();
		}
		if (msg === Msg.LocalMsg.FinishGuild) {
			this.hasGuilded = true;
			this.curLevel = 1;
			this.levelLayer.destroyAllChildren();
			this.spBg.color = new math.Color(DAY_HEX);
			this.loadLevel(this.curLevel);
			return;
		}
		if (msg === Msg.LocalMsg.GameFail) {
			this.scheduleOnce(() => {
				this.levelLayer.destroyAllChildren();
				this.failLayer.active = true;
			}, 0.5);
			return;
		}
		// if (msg === Msg.LocalMsg.LoadGuild) {
		// 	this.curLevel === 1 && this.loadGuild();
		// 	return;
		// }
		if (msg === Msg.LocalMsg.LoadLevel) {
			if (data === 1) {
				this.loadGuild();
			}
			this.loadLevel(data);
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
		]).then(async () => {
			await this.loadWord(this.curLevel);
			// await this.loadGuild();
		});
	}

	update(deltaTime: number) {}

	async loadGuild() {
		try {
			const prefab = await ResMgr.instance.loadPrefab('prefabs/GuildLayer');
			const gulidLayer = instantiate(prefab);
			this.node.addChild(gulidLayer);
		} catch (error) {
			console.error(error);
		}
	}

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

	async loadWord(level: number) {
		this.levelLayer.destroyAllChildren();
		try {
			const prefab = await ResMgr.instance.loadPrefab(`prefabs/Word`);
			const wordNode = instantiate(prefab);
			wordNode.getComponent(Word).init(level);
			this.node.addChild(wordNode);
		} catch (error) {
			console.error(error);
		}
	}
	nextWord() {
		this.curLevel++;
		if (this.curLevel > 3) this.curLevel = 1;
		this.levelLayer.destroyAllChildren();
		this.loadWord(this.curLevel);
		this.spBg.color = new math.Color(DAY_HEX);
	}

	nextLevel() {
		this.curLevel++;
		if (this.curLevel > 3) this.curLevel = 1;
		this.levelLayer.destroyAllChildren();
		this.loadLevel(this.curLevel);
		this.spBg.color = new math.Color(DAY_HEX);
	}
	retryWord() {
		this.levelLayer.destroyAllChildren();
		this.loadWord(this.curLevel);
		this.spBg.color = new math.Color(DAY_HEX);
	}
	retryLevel() {
		this.levelLayer.destroyAllChildren();
		this.loadLevel(this.curLevel);
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

	onBtnClickToReturn() {
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/retry');
		tween(this.ndClock)
			.repeat(120, tween(this.ndClock).by(0.01, { angle: 6 }))
			.call(() => {
				ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.Retry, null);
				this.failLayer.active = false;
			})
			.start();
	}
	onBtnClickToEnd() {
		director.loadScene('StartScene');
	}
}
