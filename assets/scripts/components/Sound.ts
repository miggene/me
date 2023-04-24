import { _decorator, AudioClip, Component, Node } from 'cc';
import AudioMgr from '../core/mgrs/AudioMgr';
import { Observer } from '../core/observer/Observer';
import Msg from '../core/msg/Msg';
import ResMgr from '../core/mgrs/ResMgr';
const { ccclass, property } = _decorator;

@ccclass('Sound')
export class Sound extends Observer {
	public getMsgList(): string[] {
		return [Msg.LocalMsg.PlaySound];
	}

	public onMsg(msg: any, data: any): void {}

	start() {}

	update(deltaTime: number) {}
}
