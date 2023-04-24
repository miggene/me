import { _decorator, Component, Node } from 'cc';
import ObserverMgr from '../core/observer/ObserverMgr';
import Msg from '../core/msg/Msg';
const { ccclass, property } = _decorator;

@ccclass('Love')
export class Love extends Component {
	start() {}

	update(deltaTime: number) {}

	nextLevel() {
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.NextLevel, null);
		ObserverMgr.instance.dispatchMsg(Msg.LocalMsg.PlaySound, 'sounds/jump');
	}
}
