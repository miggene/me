export type Act = StayAct | MoveAct | DisappearAct;

export type StayAct = {
	type: number;
	x: number;
	y: number;
	rotation: number;
	scale: number;
	stayTime: number;
};

export type MoveAct = {
	type: number;
	x: number;
	y: number;
	rotation: number;
	scale: number;
	moveTime: number;
};

export type DisappearAct = {
	type: number;
};

export type BattleHurtInfo = {
	allAtk: number;
	runeHurt: number;
	effectHurt: number;
	higherHurtPer: number;
};

export type Weapon = {
	weaponId: number;
	icon: string;
	resource: string;
	atk: number;
	requiredWeapon: number[];
	requiredGold: number;
	maxLevel: number;
	name: string;
	quality: number;
};

export type Assassin = {
	assassin: string;
	hp: number;
	action: string;
};

export type LevelData = {
	levelId: number;
	rewards: string;
	killedNum: number;
	effect: string;
	groups: { assassins: Assassin[]; groupTime: number }[];
};

export type NewbieLevel = LevelData & {
	guildGroups: {
		groupTime: number;
		assassins: Assassin[];
	};
};

export type WeaponStrength = {
	weaponId: number;
	strengthenLevel: number;
	golds: number;
	successRate: number;
	atk: number;
	degrade: boolean;
};

export type TimeReward = {
	rewardId: number;
	rewards: string;
	appearTiming: number;
	disappearTiming: number;
	obtainType: number;
};

export type Item = {
	itemId: number;
	icon: string;
	name: string;
	quality: number;
};

export type Rune = {
	runeId: number;
	effectType: number;
	effectValue: number;
	effectText: string;
	composeId: string;
	quality: number;
	icon: string;
	runeLevel: number;
};

export enum Status {
	Alive,
	Hurt,
	Dead,
	ActionFinished,
	Pause,
}

export enum Music {
	Main,
	Battle,
}
