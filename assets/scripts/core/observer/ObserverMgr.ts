type Listener = (...args) => void;

type MsgListener = {
	listener: Listener;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	target: any;
};

type MsgListenerMap = { [key: string]: MsgListener[] };

export default class ObserverMgr {
	public msgListenerMap: MsgListenerMap;

	private static _instance: ObserverMgr;
	public static get instance(): ObserverMgr {
		if (!this._instance) this._instance = new ObserverMgr();
		return this._instance;
	}

	constructor() {
		this.msgListenerMap = {};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public addEventListener(msg: string, listener: Listener, target: any) {
		if (target == null) {
			console.error(`消息[${msg}]监听的目标作用域必须存在`);
			return false;
		}

		if (this.msgListenerMap[msg] == null) {
			this.msgListenerMap[msg] = [];
		}

		const index = this.msgListenerMap[msg].findIndex(
			(v) => v.listener === listener && v.target === target
		);
		if (index > -1) {
			console.error(
				`已存在消息[${msg}]的同一个func[${listener}]/target[${target}]的监听`
			);
			return false;
		}
		const msgListener: MsgListener = { listener, target };
		this.msgListenerMap[msg].push(msgListener);
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
	public removeEventListener(msg: string, listener: Function, target: any) {
		if (this.msgListenerMap[msg] == null) return false;
		for (let i = 0; i < this.msgListenerMap[msg].length; ) {
			if (
				this.msgListenerMap[msg][i].listener === listener &&
				this.msgListenerMap[msg][i].target === target
			) {
				this.msgListenerMap[msg].splice(i, 1);
			} else {
				++i;
			}
		}
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public removeEventListenerWithTarget(target: any) {
		for (const key in this.msgListenerMap) {
			if (Object.prototype.hasOwnProperty.call(this.msgListenerMap, key)) {
				this.msgListenerMap[key] = this.msgListenerMap[key].filter(
					(v) => v.target !== target
				);
			}
		}
	}

	public clearAllEventListener() {
		this.msgListenerMap = {};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public dispatchMsg(msg: string, data: any) {
		const msgListeners = this.msgListenerMap[msg];
		if (msgListeners) {
			for (const msgListener of msgListeners) {
				const { target, listener } = msgListener;
				if (target && listener) {
					listener.apply(target, [msg, data]);
				}
			}
		}
	}
}
