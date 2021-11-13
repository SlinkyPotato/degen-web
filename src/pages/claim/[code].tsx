import {
    NextPage,
} from 'next';
import { signIn, useSession } from 'next-auth/client';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

const Code: NextPage<any> = () => {
    const claimCode: string = useRouter().query.code as string;
    const [session, loading] = useSession();
    if (loading) {
        return (
            <>loading...</>
        );
    }
    if (!session || !session.isTwitterLinked) {
        return (
            <>
                <button onClick={() => signIn('twitter', {}).then()}>Sign in to Twitter</button>
            </>
        );
    }
    return (
      <>
          <button onClick={() => tweetToClaimPOAP(session, claimCode)}>Tweet to Claim POAP</button>
      </>
    );
};

const tweetToClaimPOAP = (session: Session, claimCode: string) => {
    console.log(session);
    console.log(claimCode);
};

export default Code;