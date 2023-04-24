import { Asset, AudioClip, Prefab, resources, Sprite, SpriteFrame } from 'cc';

export default class ResMgr {
	private static _instance: ResMgr;
	public static get instance() {
		if (!this._instance) this._instance = new ResMgr();
		return this._instance;
	}

	// 预加载某文件夹下的所有图片
	public async preloadSpriteFrames(dirPath: string) {
		return new Promise((resolve, reject) => {
			resources.preloadDir(dirPath, SpriteFrame, (err, data: any) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}

	// 加载某文件夹下的所有图片
	public async loadSpriteFrames(dirPath: string): Promise<SpriteFrame[]> {
		return new Promise((resolve, reject) => {
			resources.loadDir(
				dirPath,
				SpriteFrame,
				(err, spriteFrames: SpriteFrame[]) => {
					if (err) reject(err);
					else resolve(spriteFrames);
				}
			);
		});
	}

	// 加载图片资源
	public async loadSpriteFrame(path: string) {
		return new Promise((resolve, reject) => {
			resources.load(path, SpriteFrame, (err, spriteFrame: SpriteFrame) => {
				if (err) reject(err);
				else resolve(spriteFrame);
			});
		});
	}

	// Sprite动态替换图片
	// eslint-disable-next-line @typescript-eslint/ban-types
	public setSpriteFrame(path: string, sp: Sprite, cb?: Function) {
		sp &&
			sp.node.isValid &&
			this.loadSpriteFrame(`${path}/spriteFrame`)
				.then((spriteFrame: SpriteFrame) => {
					sp.spriteFrame = spriteFrame;
					if (cb) cb();
				})
				.catch((err) => console.error(err));
	}

	// 加载预制资源
	public async loadPrefab(path: string): Promise<Prefab> {
		return new Promise((resolve, reject) => {
			resources.load(path, Prefab, (err, data: Prefab) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}

	// 预加载音频资源
	public async preloadAudioDirs(dirPath: string) {
		return new Promise((resolve, reject) => {
			resources.loadDir(dirPath, (err, data: Asset[]) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}
	// 加载音频资源
	public async loadAudioClips(path: string): Promise<AudioClip> {
		return new Promise((resolve, reject) => {
			resources.load(path, AudioClip, (err, data: AudioClip) => {
				if (err) reject(err);
				else resolve(data);
			});
		});
	}
}
