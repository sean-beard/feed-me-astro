import { SubscriptionForm } from "./SubscriptionForm";
import { SubscriptionList } from "./SubscriptionList";
import { useSubscriptions } from "./useSubscriptions";

interface Props {
  token: string;
}

export const ManageFeedPage = ({ token }: Props) => {
  const { subs, subsLoading, subsError, refetchSubs } = useSubscriptions();

  return (
    <div style={{ textAlign: "center" }}>
      <section>
        <SubscriptionForm refetchSubs={refetchSubs} token={token} />
      </section>
      <section>
        <SubscriptionList
          subs={subs}
          loading={subsLoading}
          error={subsError}
          token={token}
          refetchSubs={refetchSubs}
        />
      </section>
    </div>
  );
};
