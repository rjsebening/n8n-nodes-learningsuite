import type {
	ICredentialDataDecryptedObject,
	ICredentialTestFunctions,
	ICredentialsDecrypted,
	INodeCredentialTestResult,
} from 'n8n-workflow';

export const methods = {
	credentialTest: {
		async learningSuiteApiTest(
			this: ICredentialTestFunctions,
			credential: ICredentialsDecrypted<ICredentialDataDecryptedObject>,
		): Promise<INodeCredentialTestResult> {
			const baseUrl = String(credential.data?.baseUrl || '').trim();
			const apiKey = String(credential.data?.apiKey || '').trim();

			if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
				return { status: 'Error', message: 'Invalid or missing Base URL (must start with http/https).' };
			}
			if (!apiKey) return { status: 'Error', message: 'Missing API Key.' };

			try {
				const res = await this.helpers.request({
					baseURL: baseUrl,
					url: '/auth',
					method: 'GET',
					headers: { accept: 'application/json', 'X-API-KEY': apiKey },
					json: true,
				});
				if (res) return { status: 'OK', message: 'Authentication successful!' };
				return { status: 'Error', message: 'No response from API.' };
			} catch (error: any) {
				const msg = error?.message || error?.toString?.() || 'Unknown error';
				return { status: 'Error', message: `Credential test failed: ${msg}` };
			}
		},
	},
};
