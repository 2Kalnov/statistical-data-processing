interface StatisticalDataObject { dataArray: number[] };

function parseStatisticalData(stringData: string): number[] {
	const data: StatisticalDataObject = JSON.parse(stringData);
	return data["dataArray"];
}

function readStatisticalFile(event: any, callback: Function): void {
	const file: File = event.target.files[0];
	let statisticalData;

	if (file !== undefined) {
		const reader = new FileReader();
		reader.onloadend = async function (e: any) {
			statisticalData = e.target.result;
			callback(statisticalData);
		}
		reader.readAsText(file);
	}
}

function formatDecimals(number: number) {
	let numberString: string = number.toString();
	let result: string;
	const onlyZerosAfterDotPattern = /[\.,]0+$/;
	const extraZerosPattern = /0+$/;

	if (numberString.match(onlyZerosAfterDotPattern) === null)
		result = numberString.replace(extraZerosPattern, '');
	else
		result = numberString.replace(onlyZerosAfterDotPattern, '');

	return result;
}

export { readStatisticalFile as ReadStatisticalFile };
export { parseStatisticalData as ParseStatisticalData };