import { AudioClip, AudioSource } from 'cc';

export default class AudioMgr {
	private static _instance: AudioMgr;
	public static get instance() {
		if (!this._instance) this._instance = new AudioMgr();
		return this._instance;
	}

	private audioSource: AudioSource;

	public init(audioSource: AudioSource) {
		this.audioSource = audioSource;
	}

	public playMusic(clip: AudioClip, loop = true) {
		if (
			this.audioSource.clip &&
			this.audioSource.clip.name === clip.name &&
			this.audioSource.playing
		)
			return;
		this.audioSource.stop();
		this.audioSource.clip = clip;
		this.audioSource.loop = loop;
		this.audioSource.play();
	}

	public stopMusic() {
		this.audioSource.stop();
		this.audioSource.clip = null;
	}
}
