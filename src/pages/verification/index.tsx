import { NextPage } from 'next';
import { useSession } from 'next-auth/client';
import AuthUtils from '../../utils/AuthUtils';
import { useRouter } from 'next/router';
import verificationTypes from '../../constants/verificationTypes';

const Index: NextPage = () => {
	const [session, isLoading] = useSession();
	AuthUtils.validateLoginSession(session, isLoading);

	const router = useRouter();
	const verificationType = router.query['type'];
	if (verificationType === verificationTypes.TWITTER) {
		return (
			<>
				<p>Please link your twitter account.</p>
				<button>Link Twitter</button>
			</>
		);
	}
	return (
		<p>Verification type not found.</p>
	);
};

export default Index;