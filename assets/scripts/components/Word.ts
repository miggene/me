import { _decorator, Component, Node, Sprite } from 'cc';
import ObserverMgr from '../core/observer/ObserverMgr';
import Msg from '../core/msg/Msg';
const { ccclass, property } = _decorator;

@ccclass('Word')
export class Word extends Component {
	@property([Sprite])
	wordList: Sprite[] = [];

	private curLevel: number;

	start() {}

	update(deltaTime: number) {}

	init(curLevel: number) {
		this.curLevel = curLevel;
		this.wordList.forEach((v, index) => {
			v.node.active = index === curLevel - 1;
		});
	}

	onBtnClickToClose() {
		this.node.destroy();
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.LoadLevel, this.curLevel);
	}
}
