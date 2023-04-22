import { sys } from 'cc';

// 浏览器保存数据至本地
export function saveForWebBrowser(Json: JSON, FileName: string) {
	const JsonString = JSON.stringify(Json);
	if (sys.isBrowser) {
		const textFileAsBlob = new Blob([JsonString]);
		const downloadLink = document.createElement('a');
		downloadLink.download = FileName;
		downloadLink.innerHTML = 'Download File';
		if (window.URL != null) {
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		} else {
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = () => {
				window.URL.revokeObjectURL(downloadLink.href);
				document.body.removeChild(downloadLink);
			};
			downloadLink.style.display = 'none';
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	}
}

// 比较两个时间戳是否是同一天
export function isSameDate(ts1: number, ts2: number) {
	const date1 = new Date(ts1);
	const y1 = date1.getFullYear();
	const m1 = date1.getMonth();
	const d1 = date1.getDate();

	const date2 = new Date(ts2);
	const y2 = date2.getFullYear();
	const m2 = date2.getMonth();
	const d2 = date2.getDate();

	return y1 === y2 && m1 === m2 && d1 === d2;
}

//转换时间长度为时分秒,duration单位是毫秒
export function convertTimeDuration(duration: number) {
	const durationInSeconds = Math.floor(duration / 1000);
	const h = Math.floor(durationInSeconds / 3600);
	const m = Math.floor((durationInSeconds % 3600) / 60);
	const s = Math.floor((durationInSeconds % 3600) % 60);
	const HH = h < 10 ? `0${h}` : `${h}`;
	const MM = m < 10 ? `0${m}` : `${m}`;
	const SS = s < 10 ? `0${s}` : `${s}`;
	return `${HH}:${MM}:${SS}`;
}

//格式化金币
export function formatGold(gold: number | string) {
	const goldInNumber = +gold.toString();
	return goldInNumber < 10000
		? Math.round(goldInNumber).toString()
		: Math.floor(goldInNumber / 10000) + 'W';
}
