import { useEffect, useState } from "react";
import "materialize-css/dist/js/materialize.min";
import type { User } from "utils/types";
import { logout } from "utils/logout";

import "./styles.css";

const baseApiUrl = import.meta.env.PUBLIC_BASE_API_URL;
const loginUrl = `${baseApiUrl}/auth/github`;

interface Props {
  user?: User;
}

export const MobileNav = ({ user }: Props) => {
  useEffect(() => {
    const sideNav = document.querySelector(".sidenav");
    // @ts-ignore
    window.M.Sidenav.init(sideNav);
  }, []);

  return (
    <div className="mobile-nav">
      <nav className="indigo darken-4">
        <a href="#" data-target="slide-out" className="sidenav-trigger">
          <i className="material-icons">menu</i>
        </a>
        <h1>
          <a href="/">FeedMe</a>
        </h1>
      </nav>

      <ul id="slide-out" className="sidenav">
        <li>
          <div className="user-view">
            <div className="background indigo darken-4"></div>
            {user && (
              <>
                <p className="user-name">{user.name}</p>
                <p>{user.email}</p>
              </>
            )}
          </div>
        </li>

        {user && (
          <>
            <li>
              <a className="sidenav-close" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="sidenav-close" href="/manage">
                Manage Feeds
              </a>
            </li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              <button
                className="btn sidenav-btn sidenav-close"
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </>
        )}

        {!user && (
          <li>
            <a className="sidenav-close" href={loginUrl}>
              Login to Github
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};