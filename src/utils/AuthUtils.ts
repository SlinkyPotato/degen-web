import { Session } from 'next-auth';

const AuthUtils = {
	validateLoginSession: (session: Session | null, isLoading?: boolean) => {
		console.log('validating login session');
		isLoading = (isLoading != null) ? isLoading : false;

		if (isLoading) {
			return null;
		}

		if (!isLoading && !session) {
			window.open('/api/auth/signin', '_self');
		}
		console.log('session validated');
	},
};

export default AuthUtils;