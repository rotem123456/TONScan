import axios from "axios";
import https from "https";
import { Buffer } from "buffer";
import PromptSync, { Prompt } from "prompt-sync";

const prompt = PromptSync();

const API_KEY: string =
	"c1d5e62444601bd2dc7377e2e2fb94f69ca85886da1b574da700a6261170af3f";

let TxHashBuffer: string[] = [];
let tx_hash: string = "";

interface returned_object {
	in_msg: string;
	hex: string;
}

const basehash = (hash: string) => {
	return `https://toncenter.com/api/v3/transactions?hash=${hash}&offset=0&sort=desc`;
};

const agent = new https.Agent({
	rejectUnauthorized: false,
});

let obj: returned_object[] = [];
let in_msg_arr: string[] = [];
const GetTx = async (hashs: string[]): Promise<any> => {
	for (let index = 0; index < hashs.length - 1; index++) {
		try {
			const response = await axios.get(basehash(hashs[index]), {
				httpsAgent: agent,
				headers: {
					"X-API-Key": API_KEY,
				},
			});
			const in_hash = Buffer.from(
				response.data.transactions[0].in_msg.hash,
				"base64"
			).toString("hex");
			const hex = Buffer.from(
				response.data.transactions[0].hash,
				"base64"
			).toString("hex");
			const response_obj: returned_object = {
				in_msg: in_hash,
				hex: hex,
			};
			obj.push(response_obj);
			// in_msg_arr.push(response_obj.in_msg);
		} catch (error) {
			console.error("Error fetching transaction:", error);
			throw error;
		}
	}
	return obj;
};

while (tx_hash != "END") {
	tx_hash = prompt("TX_HASH: ").toString();
	TxHashBuffer.push(tx_hash);
}

(async () => {
	try {
		const result = await GetTx(TxHashBuffer);
		console.log(result);
	} catch (error) {
		console.error("Error in main execution:", error);
	}
})();
