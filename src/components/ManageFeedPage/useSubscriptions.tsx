import { useEffect, useState } from "react";
import type { Subscription } from "utils/types";

export const useSubscriptions = (): {
  subs: Subscription[];
  subsLoading: boolean;
  subsError: string;
  refetchSubs: () => Promise<void>;
} => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError] = useState("");

  const fetchSubs = async (): Promise<void> => {
    setSubsLoading(true);

    try {
      const response = await fetch("/subscription.json", {
        headers: { "Content-Type": "application/json" },
      });

      const fetchedSubs = await response.json();

      setSubs(fetchedSubs);
    } catch (error) {
      console.log(error);

      setSubsError(
        "Oops! There was an issue getting your subscriptions. Please try again later."
      );
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  return {
    subs,
    subsLoading,
    subsError,
    refetchSubs: fetchSubs,
  };
};
