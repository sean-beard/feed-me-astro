import { useState } from "react";

export const useFilters = () => {
  const [showArticles, setShowArticles] = useState(true);
  const [showPodcasts, setShowPodcasts] = useState(true);
  const [showYoutube, setShowYoutube] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [shouldFilterUnread, setShouldFilterUnread] = useState(true);

  return {
    showArticles,
    setShowArticles,
    showPodcasts,
    setShowPodcasts,
    showYoutube,
    setShowYoutube,
    searchTerm,
    setSearchTerm,
    shouldFilterUnread,
    setShouldFilterUnread,
  };
};
